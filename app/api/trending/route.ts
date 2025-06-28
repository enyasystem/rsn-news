import { fetchLatestNews } from '@/lib/news-service'
import type { NextRequest } from 'next/server'
import type { NewsArticle } from '@/lib/news-api'

// In-memory cache for trending news
let cachedTrending: NewsArticle[] = []
let lastCacheTime = 0
const CACHE_TTL = 5 * 60 * 1000 // 5 minutes

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const limit = parseInt(searchParams.get('limit') || '5', 10)

  try {
    // Always fetch from sources (not localhost)
    const allNews: NewsArticle[] = await fetchLatestNews('all', 30)
    // Trending logic: always sort by recency (publishedAt)
    const trending = [...allNews].sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()).slice(0, limit)
    // Update cache
    cachedTrending = trending
    lastCacheTime = Date.now()
    return Response.json({ articles: trending })
  } catch (error) {
    // On error, return cached trending news if available and not stale
    if (cachedTrending.length > 0 && Date.now() - lastCacheTime < CACHE_TTL) {
      return Response.json({ articles: cachedTrending })
    }
    return Response.json({ articles: [] }, { status: 500 })
  }
}
