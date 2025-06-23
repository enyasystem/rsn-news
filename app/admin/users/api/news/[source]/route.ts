import { NextResponse } from "next/server"
import { fetchNewsFromSource } from "@/lib/news-api"

export async function GET(request: Request, { params }: { params: { source: string } }) {
  const { source } = await params
  const { searchParams } = new URL(request.url)
  const limit = Number.parseInt(searchParams.get("limit") || "10")

  try {
    console.log(`API route: Fetching news from source ${source}`)
    const articles = await fetchNewsFromSource(source)

    return NextResponse.json({
      source,
      articles: articles.slice(0, limit),
    })
  } catch (error) {
    console.error(`API route: Error fetching news from ${source}:`, error)

    // Return a more graceful error response
    return NextResponse.json(
      {
        source,
        error: `Failed to fetch news from ${source}`,
        articles: [], // Return empty array instead of error
      },
      { status: 200 }, // Return 200 OK instead of error status
    )
  }
}
