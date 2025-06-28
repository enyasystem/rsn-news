import { fetchLatestNews } from '@/lib/news-service'
import type { NextRequest } from 'next/server'
import type { NewsArticle } from '@/lib/news-api'

// Simple trending logic: top 5 most recent news (admin + external), can be improved
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const limit = parseInt(searchParams.get('limit') || '5', 10)

  // Fetch all news (admin + external, already deduped and sorted by date)
  const allNews: NewsArticle[] = await fetchLatestNews('all', 30)

  // Trending logic: always sort by recency (publishedAt)
  const trending = [...allNews].sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()).slice(0, limit)

  return Response.json({ articles: trending })
}
