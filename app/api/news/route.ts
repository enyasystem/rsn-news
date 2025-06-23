import { NextResponse } from "next/server";
import { fetchLatestNews } from "@/lib/news-service";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get("limit") || "18", 10);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const articles = await fetchLatestNews("all", limit * page);
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
    console.error("Error fetching latest news:", error);
    return NextResponse.json({ articles: [], error: "Failed to fetch news." }, { status: 500 });
  }
}
