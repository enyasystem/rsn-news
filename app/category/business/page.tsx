import { fetchNewsByCategory } from "@/lib/news-service"
import { NewsCard } from "@/components/news-card"

export default async function BusinessPage() {
  const articles = await fetchNewsByCategory("business", 10)
  return (
    <section>
      <h1 className="text-3xl font-bold mb-6">Business News</h1>
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
