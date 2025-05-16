"use client"

import { useState, useEffect } from "react"
import { fetchLatestNews } from "@/lib/news-service"
import { NewsCard } from "@/components/news-card"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import type { NewsArticle } from "@/lib/news-api"

export default function LatestNewsPage() {
  const [articles, setArticles] = useState<NewsArticle[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadAllNews = async () => {
      setLoading(true)
      setError(null)
      try {
        const data = await fetchLatestNews("all", 30)
        setArticles(data)
      } catch (error) {
        setError("Failed to load news.")
      } finally {
        setLoading(false)
      }
    }
    loadAllNews()
  }, [])

  if (loading) {
    return (
      <section>
        <h1 className="text-3xl font-bold mb-6">All Latest News</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[...Array(8)].map((_, i) => (
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
      </section>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive" className="my-6">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  if (articles.length === 0) {
    return (
      <section>
        <h1 className="text-3xl font-bold mb-6">All Latest News</h1>
        <div className="text-center py-12 bg-muted/30 rounded-lg">
          <p className="text-muted-foreground">No news available at the moment.</p>
        </div>
      </section>
    )
  }

  return (
    <section>
      <h1 className="text-3xl font-bold mb-6">All Latest News</h1>
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
