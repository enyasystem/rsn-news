import { fetchNewsByCategory } from "@/lib/news-service"
import { NewsCard } from "@/components/news-card"

export default async function CategoryPage({ params }: { params?: { slug?: string } }) {
  // Fallback for params or slug to prevent undefined errors during build
  const slug = (params && params.slug) ? params.slug : "sports"
  const articles = await fetchNewsByCategory(slug, 10)
  return (
    <section>
      <h1 className="text-3xl font-bold mb-6">{slug.charAt(0).toUpperCase() + slug.slice(1)} News</h1>
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
