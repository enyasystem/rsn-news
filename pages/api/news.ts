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
      let imageUrl = "";
      if (files.image) {
        const file = Array.isArray(files.image) ? files.image[0] : files.image;
        imageUrl = "/uploads/" + path.basename((file as any).filepath || (file as any).path);
      }
      if (!title || !content || !slug) {
        res.status(400).json({ error: "Missing required fields." });
        return;
      }
      try {
        const news = await prisma.news.create({
          data: {
            title: String(title),
            content: String(content),
            imageUrl,
            slug: String(slug),
            categoryId: categoryId ? Number(categoryId) : null,
          },
        });
        res.status(200).json(news);
      } catch (error) {
        res.status(500).json({ error: "Failed to create news post.", details: String(error) });
      }
    });
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
