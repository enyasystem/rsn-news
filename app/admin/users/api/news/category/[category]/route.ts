import { NextResponse } from "next/server"
import { fetchNewsByCategory } from "@/lib/news-api"

export async function GET(request: Request, { params }: { params: { category: string } }) {
  const category = params.category
  const { searchParams } = new URL(request.url)
  const limit = Number.parseInt(searchParams.get("limit") || "10")

  try {
    const articles = await fetchNewsByCategory(category)

    return NextResponse.json({
      category,
      articles: articles.slice(0, limit),
    })
  } catch (error) {
    console.error(`Error fetching news for category ${category}:`, error)
    return NextResponse.json({ error: `Failed to fetch news for category ${category}` }, { status: 500 })
  }
}
