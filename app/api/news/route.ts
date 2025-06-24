import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get("limit") || "18", 10);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const articles = await prisma.news.findMany({
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
      include: { category: true, author: true },
    });
    return NextResponse.json({ articles });
  } catch (error) {
    return NextResponse.json({ articles: [], error: "Failed to fetch news." }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, content, imageUrl, slug, categoryId } = body;
    if (!title || !content || !slug) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }
    const news = await prisma.news.create({
      data: {
        title,
        content,
        imageUrl,
        slug,
        categoryId: categoryId || null,
      },
    });
    return NextResponse.json(news);
  } catch (error) {
    return NextResponse.json({ error: "Failed to create news post." }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();
    if (!id) {
      return NextResponse.json({ error: "Missing news post id." }, { status: 400 });
    }
    await prisma.news.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete news post." }, { status: 500 });
  }
}
