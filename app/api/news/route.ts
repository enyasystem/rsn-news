import { NextResponse } from "next/server"
import { fetchNewsFromAllSources, fetchNewsFromSource, searchNews } from "@/lib/news-api"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const category = searchParams.get("category")
  const source = searchParams.get("source")
  const query = searchParams.get("q")
  const limit = Number.parseInt(searchParams.get("limit") || "10")
  const page = Number.parseInt(searchParams.get("page") || "1")

  try {
    let articles

    if (query) {
      // Search functionality
      articles = await searchNews(query, category || undefined, source || undefined)
    } else if (source && source !== "all") {
      // Source-specific news
      articles = await fetchNewsFromSource(source)

      if (category && category !== "all") {
        articles = articles.filter((article) => article.category.toLowerCase() === category.toLowerCase())
      }
    } else {
      // All news or category-filtered news
      articles = await fetchNewsFromAllSources()

      if (category && category !== "all") {
        articles = articles.filter((article) => article.category.toLowerCase() === category.toLowerCase())
      }
    }

    // Apply pagination
    const total = articles.length
    const skip = (page - 1) * limit
    const paginatedArticles = articles.slice(skip, skip + limit)

    return NextResponse.json({
      articles: paginatedArticles,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching news:", error)
    return NextResponse.json({ error: "Failed to fetch news" }, { status: 500 })
  }
}
