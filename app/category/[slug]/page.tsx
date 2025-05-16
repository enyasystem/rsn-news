"use client"
import { notFound } from "next/navigation"
import Image from "next/image"
import { formatDistanceToNow } from "date-fns"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { fetchNewsByCategory } from "@/lib/news-service"
import { NewsCard } from "@/components/news-card"
import { Pagination } from "@/components/ui/pagination"
import { ModernPagination } from "@/components/ui/modern-pagination"
import { useState, useEffect } from "react"
import type { NewsArticle } from "@/lib/news-api"

interface CategoryPageProps {
  params: {
    slug: string
  }
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const [page, setPage] = useState(1)
  const pageSize = 12
  const [articles, setArticles] = useState<NewsArticle[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const categoryName = params.slug.charAt(0).toUpperCase() + params.slug.slice(1)

  useEffect(() => {
    const loadCategoryNews = async () => {
      setLoading(true)
      setError(null)
      try {
        const paramsObj = new URLSearchParams({ limit: pageSize.toString(), page: page.toString() })
        const res = await fetch(`/api/news?category=${params.slug}&${paramsObj.toString()}`)
        if (!res.ok) throw new Error("Failed to load news.")
        const data = await res.json()
        setArticles(data.articles)
        setTotal(data.pagination?.total || 0)
      } catch (error) {
        setError("Failed to load news.")
      } finally {
        setLoading(false)
      }
    }
    loadCategoryNews()
  }, [params.slug, page])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">{categoryName} News</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="rounded-lg overflow-hidden shadow-md">
              <div className="h-48 w-full bg-gray-200 animate-pulse" />
              <div className="p-4 space-y-3">
                <div className="h-6 w-3/4 bg-gray-200 animate-pulse" />
                <div className="h-4 w-full bg-gray-200 animate-pulse" />
                <div className="h-4 w-full bg-gray-200 animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">{categoryName} News</h1>
        <p className="text-red-500">{error}</p>
      </div>
    )
  }

  if (articles.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">{categoryName} News</h1>
        <p className="text-muted-foreground">No news available at the moment.</p>
      </div>
    )
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
      <div className="flex justify-center mt-8">
        <ModernPagination
          currentPage={page}
          totalCount={total}
          pageSize={pageSize}
          onPageChange={setPage}
        />
      </div>
    </div>
  )
}
