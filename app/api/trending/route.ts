import { NextResponse } from "next/server"
import { getTrendingNews } from "@/lib/news-api"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const limit = Number.parseInt(searchParams.get("limit") || "5")

  try {
    const articles = await getTrendingNews(limit)

    return NextResponse.json({
      articles,
    })
  } catch (error) {
    console.error("Error fetching trending news:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch trending news",
        articles: [], // Return empty array instead of error
      },
      { status: 200 },
    ) // Return 200 OK instead of error status
  }
}
