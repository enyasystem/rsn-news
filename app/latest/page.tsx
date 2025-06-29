import { fetchLatestNews } from "@/lib/news-service"
import { getAllAdminNews } from "@/lib/admin-news"
import type { NewsArticle } from "@/lib/news-api"
import { NewsCard } from "@/components/news-card"

export default async function LatestPage() {
  // Fetch both admin and external news in parallel
  const [externalNewsRaw, adminArticles] = await Promise.all([
    fetchLatestNews("all", 100) as Promise<any>,
    getAllAdminNews()
  ])

  function hasArticlesProp(obj: any): obj is { articles: NewsArticle[] } {
    return obj && typeof obj === 'object' && Array.isArray(obj.articles)
  }
  const externalNews = Array.isArray(externalNewsRaw)
    ? externalNewsRaw
    : hasArticlesProp(externalNewsRaw)
      ? externalNewsRaw.articles
      : []

  // Merge and sort all news by date (desc)
  const getDate = (item: NewsArticle) =>
    item.created_at ?? item.publishedAt ?? item.pubDate ?? "1970-01-01T00:00:00Z"
  const merged = [...adminArticles, ...externalNews].sort(
    (a, b) => new Date(getDate(b)).getTime() - new Date(getDate(a)).getTime()
  )

  return (
    <section>
      <h1 className="text-3xl font-bold mb-6">All Latest News</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {merged.map(article => (
          <NewsCard key={article.id} article={article} />
        ))}
      </div>
    </section>
  )
}
