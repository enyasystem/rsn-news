import { NextResponse } from "next/server";
import { fetchNewsFromSource } from "@/lib/news-api";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: Request, context: any) {
  const params = await context.params;
  try {
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const source = params.source;

    // Fetch news from the database for this source
    const dbNews = await prisma.news.findMany({
      where: {
        // If you have a source field in DB, filter by it. Otherwise, fetch all admin news.
        // source: source,
      },
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
      publishedAt: n.createdAt.toISOString(),
      author: n.authorId ? undefined : undefined, // Optionally map author
    }));

    // Fetch external news
    const externalArticles = await fetchNewsFromSource(source);

    // Merge: DB news first, then external
    const allArticles = [...dbArticles, ...externalArticles];

    // Sort by publishedAt/createdAt desc (if needed)
    allArticles.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

    // Paginate
    const paged = allArticles.slice((page - 1) * limit, page * limit);
    return NextResponse.json({
      articles: paged,
      pagination: {
        page,
        limit,
        total: allArticles.length,
      },
    });
  } catch (error) {
    console.error(`Error fetching news for source: ${params.source}`, error);
    return NextResponse.json({ articles: [], error: "Failed to fetch news for this source." }, { status: 500 });
  }
}
