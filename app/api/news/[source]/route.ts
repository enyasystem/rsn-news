import { NextResponse } from "next/server";
import { fetchLatestNews } from "@/lib/news-service";

export const dynamic = "force-dynamic";

export async function GET(req: Request, { params }: { params: { source: string } }) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const source = params.source;
    const articles = await fetchLatestNews(source, limit * page);
    // Paginate results
    const paged = articles.slice((page - 1) * limit, page * limit);
    return NextResponse.json({
      articles: paged,
      pagination: {
        page,
        limit,
        total: articles.length,
      },
    });
  } catch (error) {
    console.error(`Error fetching news for source: ${params.source}`, error);
    return NextResponse.json({ articles: [], error: "Failed to fetch news for this source." }, { status: 500 });
  }
}
