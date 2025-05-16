import { notFound } from "next/navigation"
import Image from "next/image"
import { formatDistanceToNow } from "date-fns"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { fetchNewsByCategory } from "@/lib/news-service"
import { NewsCard } from "@/components/news-card"

interface CategoryPageProps {
  params: {
    slug: string
  }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  // Convert slug to proper case for display
  const categoryName = params.slug.charAt(0).toUpperCase() + params.slug.slice(1)

  // Fetch articles by category
  const articles = await fetchNewsByCategory(params.slug, 10)

  if (articles.length === 0) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">{categoryName} News</h1>
        <p className="text-muted-foreground mt-2">Latest {categoryName.toLowerCase()} news from across Nigeria</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((article) => (
          <a key={article.id} href={article.sourceUrl} target="_blank" rel="noopener noreferrer" className="block">
            <NewsCard article={article} />
          </a>
        ))}
      </div>
    </div>
  )
}
