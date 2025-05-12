"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { NewsCard } from "@/components/news-card"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { ChevronRight, AlertCircle } from "lucide-react"
import { fetchNewsByCategory } from "@/lib/news-service"
import type { NewsArticle } from "@/lib/news-api"

interface CategorySectionProps {
  category: string
}

export function CategorySection({ category }: CategorySectionProps) {
  const [articles, setArticles] = useState<NewsArticle[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadCategoryNews = async () => {
      setLoading(true)
      setError(null)
      try {
        const data = await fetchNewsByCategory(category.toLowerCase())
        setArticles(data.slice(0, 3))
      } catch (error) {
        console.error(`Error fetching ${category} news:`, error)
        setError(`Failed to load ${category} news.`)
      } finally {
        setLoading(false)
      }
    }

    loadCategoryNews()
  }, [category])

  return (
    <section>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">{category}</h2>
        <Link
          href={`/category/${category.toLowerCase()}`}
          className="group flex items-center text-sm font-medium text-[#CC0000] hover:text-[#AA0000]"
        >
          View All
          <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-lg overflow-hidden shadow-md">
              <Skeleton className="h-48 w-full" />
              <div className="p-4 space-y-3">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <div className="flex justify-between pt-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : articles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {articles.map((article) => (
            <NewsCard key={article.id} article={article} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-muted/30 rounded-lg">
          <p className="text-muted-foreground">No {category} news available at the moment.</p>
        </div>
      )}
    </section>
  )
}
