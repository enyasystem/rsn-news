import { NextResponse } from "next/server"
import { getArticleBySlug } from "@/lib/news-api"

export async function GET(request: Request, { params }: { params: { slug: string } }) {
  const slug = params.slug

  try {
    // Get the article by slug
    const article = await getArticleBySlug(slug)

    if (!article) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 })
    }

    // Debug log: print the sourceUrl being returned
    console.log(`[REDIRECT DEBUG] Slug: ${slug} | SourceURL: ${article.sourceUrl}`)

    // Return the source URL for redirection
    return NextResponse.json({
      sourceUrl: article.sourceUrl,
      article: {
        title: article.title,
        source: article.source,
      },
    })
  } catch (error) {
    console.error(`Error fetching article with slug ${slug} for redirect:`, error)
    return NextResponse.json({ error: "Failed to fetch article" }, { status: 500 })
  }
}
