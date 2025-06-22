import { NEWS_SOURCES } from "./news-api"
import type { NewsArticle } from "./news-api"

// Helper to get absolute URL for server-side fetches
function getAbsoluteUrl(path: string) {
  if (typeof window !== "undefined") return path // On client, use relative
  const base = process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.VERCEL_URL && `https://${process.env.VERCEL_URL}` ||
    "http://localhost:3000"
  return base + path
}

// Fetch latest news from all sources or a specific source
export async function fetchLatestNews(source = "all", limit = 15): Promise<NewsArticle[]> {
  try {
    if (source === "all") {
      // Fetch from all sources in parallel and merge
      const sourceKeys = Object.keys(NEWS_SOURCES)
      const fetches = sourceKeys.map((src) =>
        fetch(getAbsoluteUrl(`/api/news/${src}?limit=${Math.ceil(limit / sourceKeys.length)}`), {
          next: { revalidate: 300 },
        })
          .then((res) => res.ok ? res.json() : { articles: [] })
          .then((data) => data.articles || [])
      )
      const results = await Promise.all(fetches)
      // Flatten and sort by date (assuming pubDate exists)
      const merged = results.flat().sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime())
      return merged.slice(0, limit)
    } else {
      const url = `/api/news/${source}?limit=${limit}`
      const fetchUrl = getAbsoluteUrl(url)
      const response = await fetch(fetchUrl, {
        next: { revalidate: 300 },
      })
      if (!response.ok) {
        console.error(`Error fetching latest news from ${fetchUrl}: ${response.status}`)
        throw new Error(`Failed to fetch latest news: ${response.status}`)
      }
      const data = await response.json()
      return data.articles
    }
  } catch (error) {
    console.error("Error fetching latest news:", error)
    return []
  }
}

// Fetch news by category
export async function fetchNewsByCategory(category: string, limit = 9): Promise<NewsArticle[]> {
  try {
    const url = `/api/news/category/${category}?limit=${limit}`
    const fetchUrl = getAbsoluteUrl(url)
    const response = await fetch(fetchUrl, {
      next: { revalidate: 300 }, // Revalidate every 5 minutes
    })

    if (!response.ok) {
      console.error(`Error fetching news for category ${category}: ${response.status}`)
      throw new Error(`Failed to fetch news for category ${category}: ${response.status}`)
    }

    const data = await response.json()
    return data.articles
  } catch (error) {
    console.error(`Error fetching news for category ${category}:`, error)
    return []
  }
}

// Fetch trending news
export async function fetchTrendingNews(limit = 5): Promise<NewsArticle[]> {
  try {
    const url = `/api/trending?limit=${limit}`
    const fetchUrl = getAbsoluteUrl(url)
    const response = await fetch(fetchUrl, {
      next: { revalidate: 300 }, // Revalidate every 5 minutes
    })

    if (!response.ok) {
      console.error(`Error fetching trending news: ${response.status}`)
      throw new Error(`Failed to fetch trending news: ${response.status}`)
    }

    const data = await response.json()
    return data.articles
  } catch (error) {
    console.error("Error fetching trending news:", error)
    return []
  }
}

// Search news
export async function searchNews(
  query: string,
  category?: string,
  source?: string,
  limit = 10,
  page = 1,
): Promise<{ articles: NewsArticle[]; pagination: any }> {
  try {
    const params = new URLSearchParams()
    params.append("q", query)
    if (category && category !== "all") params.append("category", category)
    if (source && source !== "all") params.append("source", source)
    params.append("limit", limit.toString())
    params.append("page", page.toString())

    const url = `/api/news?${params.toString()}`
    const fetchUrl = getAbsoluteUrl(url)
    const response = await fetch(fetchUrl)

    if (!response.ok) {
      console.error(`Error searching news: ${response.status}`)
      throw new Error(`Failed to search news: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error searching news:", error)
    return { articles: [], pagination: { total: 0, page, limit, pages: 0 } }
  }
}

// Get article by slug
export async function getArticleBySlug(slug: string): Promise<NewsArticle | null> {
  try {
    const response = await fetch(`/api/news/article/${slug}`, {
      next: { revalidate: 300 }, // Revalidate every 5 minutes
    })

    if (!response.ok) {
      if (response.status === 404) {
        return null
      }
      console.error(`Error fetching article with slug ${slug}: ${response.status}`)
      throw new Error(`Failed to fetch article: ${response.status}`)
    }

    const data = await response.json()
    return data.article
  } catch (error) {
    console.error(`Error fetching article with slug ${slug}:`, error)
    return null
  }
}
