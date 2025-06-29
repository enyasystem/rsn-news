import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: Request, context: any) {
  const params = await context.params;
  try {
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const source = params.source;

    // Fetch news from the database for this source (admin or external)
    const dbNews = await prisma.news.findMany({
      where: source === 'admin' ? { source: 'Admin' } : { source },
      orderBy: { publishedAt: "desc" },
      include: {
        category: true,
      },
    });

    // Map DB news to NewsArticle shape
    const dbArticles = dbNews.map((n) => ({
      id: n.id.toString(),
      title: n.title,
      slug: n.slug,
      excerpt: n.excerpt || (n.content ? n.content.slice(0, 200) + (n.content.length > 200 ? "..." : "") : ""),
      content: n.content,
      imageUrl: n.imageUrl || "/placeholder.jpg",
      category: n.category?.name || n.category || "General",
      source: n.source || "Admin",
      sourceUrl: n.sourceUrl || "",
      publishedAt: n.publishedAt ? n.publishedAt.toISOString() : n.createdAt.toISOString(),
      author: n.authorId ? undefined : undefined,
    }));

    // Sort by publishedAt/createdAt desc
    dbArticles.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

    // Paginate
    const paged = dbArticles.slice((page - 1) * limit, page * limit);
    return NextResponse.json({
      articles: paged,
      pagination: {
        page,
        limit,
        total: dbArticles.length,
      },
    });
  } catch (error) {
    console.error(`Error fetching news for source: ${params.source}`, error);
    return NextResponse.json({ articles: [], error: "Failed to fetch news for this source." }, { status: 500 });
  }
}
