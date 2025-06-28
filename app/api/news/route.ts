import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get("limit") || "18", 10);
    const page = parseInt(searchParams.get("page") || "1", 10);
    // Only fetch admin news from DB, include category relation
    const dbNews = await prisma.news.findMany({
      orderBy: { createdAt: "desc" },
      include: { category: true },
    });
    // Map DB news to NewsArticle shape
    const dbArticles = dbNews.map((n) => ({
      id: n.id.toString(),
      title: n.title,
      slug: n.slug,
      excerpt: n.content.slice(0, 200) + (n.content.length > 200 ? "..." : ""),
      content: n.content,
      imageUrl: n.imageUrl || "/placeholder.jpg",
      category: n.category ? n.category.name : "General",
      source: "Admin",
      sourceUrl: "",
      publishedAt: n.createdAt?.toISOString?.() || n.createdAt,
      author: n.authorId ? undefined : undefined,
    }));
    // Paginate
    const paged = dbArticles.slice((page - 1) * limit, page * limit);
    return NextResponse.json({ articles: paged, pagination: { page, limit, total: dbArticles.length } });
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
    // Debug: return error details for troubleshooting (remove in production)
    return NextResponse.json({ error: "Failed to create news post.", details: String(error) }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();
    if (!id) {
      return NextResponse.json({ error: "Missing news post id." }, { status: 400 });
    }
    await prisma.news.delete({ where: { id: Number(id) } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete news post." }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, title, content, imageUrl, slug, categoryId } = body;
    if (!id || !title || !content || !slug) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
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
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update news post.", details: String(error) }, { status: 500 });
  }
}
