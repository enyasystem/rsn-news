import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import formidable, { IncomingForm, Fields, Files } from "formidable";
import cloudinary from '@/lib/cloudinary';

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
    // Return all news (regardless of authorId)
    try {
      const news = await prisma.news.findMany({
        orderBy: { createdAt: "desc" },
        include: { category: true },
      });
      res.status(200).json({ articles: news });
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
      const { title, content, slug, categoryId } = fields;
      // Debug: Log received fields for troubleshooting
      console.log('Received fields:', fields);
      let imageUrl = "";
      if (files.image) {
        const file = Array.isArray(files.image) ? files.image[0] : files.image;
        try {
          // Upload to Cloudinary
          const uploadResult = await cloudinary.uploader.upload((file as any).filepath || (file as any).path, {
            folder: "news-images"
          });
          imageUrl = uploadResult.secure_url;
        } catch (uploadErr) {
          console.error('Cloudinary upload error:', uploadErr);
          res.status(500).json({ error: "Failed to upload image to Cloudinary", details: String(uploadErr) });
          return;
        }
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
      } catch (error) {
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
