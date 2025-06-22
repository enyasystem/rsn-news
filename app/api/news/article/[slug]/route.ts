import { NextResponse } from "next/server"
import { getArticleBySlug as getExternalArticleBySlug } from "@/lib/news-api"
import prisma from "@/lib/prisma"

export async function GET(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  try {
    // Try to find admin news in the database first
    const dbArticle = await prisma.news.findUnique({ where: { slug } })
    if (dbArticle) {
      // Map DB article to NewsArticle shape
      return NextResponse.json({
        article: {
          id: dbArticle.id,
          title: dbArticle.title,
          slug: dbArticle.slug,
          excerpt: dbArticle.content.substring(0, 200) + (dbArticle.content.length > 200 ? "..." : ""),
          content: dbArticle.content,
          imageUrl: dbArticle.imageUrl || "/placeholder.svg",
          category: dbArticle.categoryId ? { name: dbArticle.categoryId.toString() } : "Uncategorized",
          source: "Admin",
          sourceUrl: "",
          publishedAt: dbArticle.createdAt.toISOString(),
          author: dbArticle.authorId ? dbArticle.authorId.toString() : undefined,
        }
      })
    }

    // Fallback to external/mock sources
    const article = await getExternalArticleBySlug(slug)
    if (!article) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 })
    }
    return NextResponse.json({ article })
  } catch (error) {
    console.error(`Error fetching article with slug ${slug}:`, error)
    return NextResponse.json({ error: "Failed to fetch article" }, { status: 500 })
  }
}
