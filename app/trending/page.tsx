import { NewsCard } from "@/components/news-card"
import { fetchLatestNews } from "@/lib/news-service"

export const dynamic = "force-dynamic";

export default async function TrendingPage() {
  // You may want to implement a fetchTrendingNews function for real trending logic
  const articles = await fetchLatestNews("all", 10)
  return (
    <section>
      <h1 className="text-3xl font-bold mb-6">Trending News</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {articles.map((article) => (
          <a key={article.id} href={article.sourceUrl} target="_blank" rel="noopener noreferrer" className="block">
            <NewsCard article={article} />
          </a>
        ))}
      </div>
    </section>
  )
}
