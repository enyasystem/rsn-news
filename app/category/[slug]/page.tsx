import { notFound } from "next/navigation"
import Image from "next/image"
import { formatDistanceToNow } from "date-fns"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { fetchNewsByCategory } from "@/lib/news-service"

interface CategoryPageProps {
  params: {
    slug: string
  }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  // Convert slug to proper case for display
  const categoryName = params.slug.charAt(0).toUpperCase() + params.slug.slice(1)

  // Fetch articles by category
  const articles = await fetchNewsByCategory(params.slug)

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
          <Card
            key={article.id}
            className="overflow-hidden group border border-gray-200 dark:border-gray-800 shadow-md"
          >
            <a href={article.sourceUrl} target="_blank" rel="noopener noreferrer" className="block">
              <div className="aspect-[16/9] w-full overflow-hidden">
                <Image
                  src={article.imageUrl || "/placeholder.svg?height=225&width=400"}
                  alt={article.title}
                  width={400}
                  height={225}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <CardContent className="p-4">
                <Badge className="mb-2 bg-[#CC0000] hover:bg-[#AA0000]">{article.category}</Badge>
                <h3 className="text-lg font-bold mb-2 line-clamp-2 group-hover:text-[#CC0000] transition-colors">
                  {article.title}
                </h3>
                <p className="text-muted-foreground text-sm mb-2 line-clamp-2">{article.excerpt}</p>
              </CardContent>
            </a>
          </Card>
        ))}
      </div>
    </div>
  )
}
