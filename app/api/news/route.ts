import { NextResponse } from "next/server";
import { fetchLatestNews } from "@/lib/news-service";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get("limit") || "18", 10);
    const page = parseInt(searchParams.get("page") || "1", 10);
    // Fetch admin news from DB
    const dbNews = await prisma.news.findMany({
      orderBy: { createdAt: "desc" },
    });
    // Map DB news to NewsArticle shape
    const dbArticles = dbNews.map((n) => ({
      id: n.id.toString(),
      title: n.title,
      slug: n.slug,
      excerpt: n.content.slice(0, 200) + (n.content.length > 200 ? "..." : ""),
      content: n.content,
      imageUrl: n.imageUrl || "/placeholder.jpg",
      category: n.category?.name || "General",
      source: "Admin",
      sourceUrl: "",
      publishedAt: n.createdAt?.toISOString?.() || n.createdAt,
      author: n.authorId ? undefined : undefined,
    }));
    // Fetch all external news
    const externalArticles = await fetchLatestNews("all", limit * page);
    // Remove any external articles that are also in dbArticles (by slug)
    const dbSlugs = new Set(dbArticles.map(a => a.slug));
    const filteredExternal = externalArticles.filter(a => !dbSlugs.has(a.slug));
    // Merge: admin news first, then external
    const allArticles = [...dbArticles, ...filteredExternal];
    // Sort by publishedAt/createdAt desc
    allArticles.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
    // Paginate
    const paged = allArticles.slice((page - 1) * limit, page * limit);
    return NextResponse.json({ articles: paged, pagination: { page, limit, total: allArticles.length } });
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
    await prisma.news.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete news post." }, { status: 500 });
  }
}
