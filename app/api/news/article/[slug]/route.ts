import { NextResponse } from "next/server"
import { getArticleBySlug } from "@/lib/news-api"

export async function GET(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  try {
    const article = await getArticleBySlug(slug)

    if (!article) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 })
    }

    return NextResponse.json({ article })
  } catch (error) {
    console.error(`Error fetching article with slug ${slug}:`, error)
    return NextResponse.json({ error: "Failed to fetch article" }, { status: 500 })
  }
}
