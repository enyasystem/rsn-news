import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const slug = params.slug;
    if (!slug) {
      return NextResponse.json({ error: "Missing slug." }, { status: 400 });
    }
    // Find news post by slug (admin news only)
    const news = await prisma.news.findUnique({
      where: { slug },
      include: { category: true },
    });
    if (!news) {
      return NextResponse.json({ error: "Article not found." }, { status: 404 });
    }
    // Map to NewsArticle shape
    const article = {
      id: news.id.toString(),
      title: news.title,
      slug: news.slug,
      excerpt: news.content.slice(0, 200) + (news.content.length > 200 ? "..." : ""),
      content: news.content,
      imageUrl: news.imageUrl || "/placeholder.jpg",
      category: news.category ? news.category.name : "General",
      source: "Admin",
      sourceUrl: "",
      publishedAt: news.createdAt?.toISOString?.() || news.createdAt,
      author: news.authorId ? undefined : undefined,
    };
    return NextResponse.json({ article });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch article.", details: String(error) }, { status: 500 });
  }
}
