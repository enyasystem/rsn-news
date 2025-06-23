"use client"

import { useState, useEffect } from "react"
import { fetchLatestNews } from "@/lib/news-service"
import { NewsCard } from "@/components/news-card"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import type { NewsArticle } from "@/lib/news-api"
import { ModernPagination } from "@/components/ui/modern-pagination"

export default function LatestNewsPage() {
  const [articles, setArticles] = useState<NewsArticle[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const pageSize = 18

  useEffect(() => {
    const loadAllNews = async () => {
      setLoading(true)
      setError(null)
      try {
        const params = new URLSearchParams({ limit: pageSize.toString(), page: page.toString() })
        const res = await fetch(`/api/news?${params.toString()}`)
        let data = null;
        try {
          data = await res.json();
        } catch (jsonErr) {
          setError(`Failed to parse JSON: ${jsonErr}`)
          setLoading(false)
          return;
        }
        if (!res.ok) {
          setError(data?.error || "Failed to load news.")
          setLoading(false)
          return;
        }
        setArticles(data.articles)
        setTotal(data.pagination?.total || 0)
      } catch (error) {
        setError(`Failed to load news: ${error}`)
      } finally {
        setLoading(false)
      }
    }
    loadAllNews()
  }, [page])

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
      <section>
        <h1 className="text-3xl font-bold mb-6">All Latest News</h1>
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-5 w-5" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </section>
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((article) => (
          <a key={article.id} href={article.sourceUrl} target="_blank" rel="noopener noreferrer" className="block">
            <NewsCard article={article} />
          </a>
        ))}
      </div>
      <div className="flex justify-center mt-8">
        <ModernPagination
          currentPage={page}
          totalCount={total}
          pageSize={pageSize}
          onPageChange={setPage}
        />
      </div>
    </section>
  )
}
