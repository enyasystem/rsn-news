import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import formidable, { IncomingForm, Fields, Files } from "formidable";
import { supabase } from '@/lib/supabaseClient';
import path from "path";
import fs from "fs";

// Helper to parse JSON body when bodyParser is false
async function parseJsonBody(req: NextApiRequest) {
  return new Promise<any>((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
    });
    req.on("end", () => {
      try {
        resolve(JSON.parse(body));
      } catch (e) {
        resolve({});
      }
    });
    req.on("error", (err) => {
      reject(err);
    });
  });
}

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    // Return all news (admin + external sources)
    try {
      const limit = parseInt(req.query.limit as string || "18", 10);
      const page = parseInt(req.query.page as string || "1", 10);
      // 1. Fetch admin news from DB
      const adminNews = await prisma.news.findMany({
        orderBy: { createdAt: "desc" },
        include: { category: true },
      });
      const adminArticles = adminNews.map((n) => ({
        id: n.id.toString(),
        title: n.title,
        slug: n.slug,
        excerpt: n.content.slice(0, 200) + (n.content.length > 200 ? "..." : ""),
        content: n.content,
        imageUrl: n.imageUrl || "/placeholder.jpg",
        category: n.category?.name || "General",
        source: "Admin",
        sourceUrl: `/news/${n.slug}`,
        publishedAt: n.createdAt.toISOString(),
        author: n.authorId ? undefined : undefined,
      }));
      // 2. Fetch external news from all sources
      const { NEWS_SOURCES } = await import("@/lib/news-api");
      const { fetchNewsFromSource } = await import("@/lib/news-api");
      const sourceKeys = Object.keys(NEWS_SOURCES);
      const fetches = sourceKeys.map((src) =>
        fetchNewsFromSource(src).then((articles) => articles || [])
      );
      const results = await Promise.all(fetches);
      const externalArticles = results.flat();
      // 3. Merge, dedupe by slug or sourceUrl, sort by publishedAt desc
      const allArticles = [...adminArticles, ...externalArticles];
      const seen = new Set();
      const deduped = allArticles.filter((a) => {
        const key = a.slug || a.sourceUrl;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });
      deduped.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
      // 4. Paginate
      const paged = deduped.slice((page - 1) * limit, page * limit);
      res.status(200).json({
        articles: paged,
        pagination: {
          page,
          limit,
          total: deduped.length,
        },
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch news.", details: String(error) });
    }
    return;
  }
  if (req.method === "POST") {
    const form = new IncomingForm();
    form.parse(req, async (err: any, fields: Fields, files: Files) => {
      if (err) {
        res.status(500).json({ error: "Image upload failed", details: String(err) });
        return;
      }
      // Always extract first value if field is array
      const getField = (field: any) => Array.isArray(field) ? field[0] : field;
      const title = getField(fields.title);
      const content = getField(fields.content);
      const slug = getField(fields.slug);
      const categoryId = getField(fields.categoryId);
      // Debug: Log received fields for troubleshooting
      console.log('Received fields:', fields);
      let imageUrl = "";
      if (files.image) {
        const file = Array.isArray(files.image) ? files.image[0] : files.image;
        const filePath = (file as any).filepath || (file as any).path;
        const fileExt = path.extname((file as any).originalFilename || (file as any).name || filePath);
        const fileName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${fileExt}`;
        const bucket = 'news-images';
        // @ts-ignore
        const { data, error: uploadError } = await supabase.storage.from(bucket).upload(fileName, fs.createReadStream(filePath), {
          contentType: (file as any).mimetype || 'image/png',
          upsert: false,
          duplex: "half",
        });
        if (uploadError) {
          console.error('Supabase upload error:', uploadError);
          res.status(500).json({ error: "Failed to upload image to Supabase", details: String(uploadError) });
          return;
        }
        // Get public URL
        const { data: publicUrlData } = supabase.storage.from(bucket).getPublicUrl(fileName);
        imageUrl = publicUrlData?.publicUrl || '';
      }
      if (!title || !content || !slug) {
        res.status(400).json({ error: "Missing required fields.", debug: { title, content, slug, categoryId, fields } });
        return;
      }
      try {
        // Prisma expects categoryId to be a number or null, but the form sends it as a string (possibly empty)
        const categoryIdNum = categoryId && String(categoryId).trim() !== '' ? Number(categoryId) : null;
        // Debug: Log all values before DB insert
        console.log('Saving news with:', { title, content, slug, imageUrl, categoryIdNum });
        const news = await prisma.news.create({
          data: {
            title: String(title),
            content: String(content),
            imageUrl,
            slug: String(slug),
            categoryId: categoryIdNum,
          },
        });
        res.status(200).json(news);
      } catch (error: any) {
        // Handle unique constraint error for slug
        if (error.code === 'P2002' && error.meta?.target?.includes('slug')) {
          res.status(400).json({ error: "A news post with this slug already exists. Please use a unique title or slug." });
          return;
        }
        // Log the error to the server console for full details
        console.error('Prisma create error:', error);
        res.status(500).json({ error: "Failed to create news post.", details: String(error), debug: { title, content, slug, categoryId, imageUrl } });
      }
    });
  } else if (req.method === "DELETE") {
    // Delete a news post by id
    try {
      let id;
      let body: any = {};
      if (req.headers["content-type"]?.includes("application/json")) {
        body = await parseJsonBody(req);
        id = body?.id;
      } else {
        id = req.query.id;
        console.log("DELETE /api/news using query param id:", id);
      }
      console.log("DELETE /api/news raw body:", body);
      console.log("DELETE /api/news id:", id);
      if (!id) {
        res.status(400).json({ error: "Missing news post id." });
        return;
      }
      await prisma.news.delete({ where: { id: Number(id) } });
      res.status(200).json({ success: true });
    } catch (error) {
      console.error("DELETE /api/news error:", error);
      res.status(500).json({ error: "Failed to delete news post.", details: String(error) });
    }
    return;
  } else if (req.method === "PUT") {
    // Update a news post
    try {
      let body: any = {};
      if (req.headers["content-type"]?.includes("application/json")) {
        body = await parseJsonBody(req);
      } else {
        body = req.body && typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      }
      const { id, title, content, imageUrl, slug, categoryId } = body;
      if (!id || !title || !content || !slug) {
        res.status(400).json({ error: "Missing required fields." });
        return;
      }
      const updated = await prisma.news.update({
        where: { id: Number(id) },
        data: {
          title,
          content,
          imageUrl,
          slug,
          categoryId: categoryId || null,
        },
      });
      res.status(200).json(updated);
    } catch (error) {
      res.status(500).json({ error: "Failed to update news post.", details: String(error) });
    }
    return;
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
