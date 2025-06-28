import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import formidable, { IncomingForm, Fields, Files } from "formidable";
import path from "path";
import fs from "fs";

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
    const form = new IncomingForm({
      uploadDir: path.join(process.cwd(), "public", "uploads"),
      keepExtensions: true,
    });
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
        imageUrl = "/uploads/" + path.basename((file as any).filepath || (file as any).path);
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
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
