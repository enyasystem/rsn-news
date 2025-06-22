"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { FeaturedNewsCard } from "@/components/featured-news-card"
import { NewsCard } from "@/components/news-card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { ChevronRight, AlertCircle } from "lucide-react"
import { fetchLatestNews } from "@/lib/news-service"
import type { NewsArticle } from "@/lib/news-api"

export function LatestNews() {
  const [articles, setArticles] = useState<NewsArticle[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadLatestNews = async () => {
      setLoading(true)
      setError(null)
      try {
        // Fetch external news and admin news in parallel
        const [externalNews, adminNews] = await Promise.all([
          fetchLatestNews("all", 15),
          fetch("/api/news").then(res => res.ok ? res.json() : [])
        ])
        // If adminNews is an object with 'articles', use that, else assume array
        const adminArticles = Array.isArray(adminNews) ? adminNews : (adminNews.articles || [])
        // Helper to get a valid date string for sorting
        const getDate = (item: NewsArticle) =>
          item.created_at ?? item.pubDate ?? item.publishedAt ?? "1970-01-01T00:00:00Z"
        // Merge: admin news first, then external news, both sorted by date
        const sortedAdmin = [...adminArticles].sort((a, b) => new Date(getDate(b)).getTime() - new Date(getDate(a)).getTime())
        const sortedExternal = [...externalNews].sort((a, b) => new Date(getDate(b)).getTime() - new Date(getDate(a)).getTime())
        const merged = [...sortedAdmin, ...sortedExternal]
        setArticles(merged)
      } catch (error) {
        console.error("Error fetching latest news:", error)
        setError("Failed to load latest news. Please try again later. " + (error instanceof Error ? error.message : String(error)))
      } finally {
        setLoading(false)
      }
    }

    loadLatestNews()
  }, [])

  if (loading && articles.length === 0) {
    return (
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Latest News</h2>
          <div className="w-20 h-6">
            <Skeleton className="h-full w-full" />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8">
          {/* Featured Article Skeleton */}
          <div className="relative rounded-xl overflow-hidden">
            <Skeleton className="h-[400px] w-full" />
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
              <div className="space-y-3">
                <Skeleton className="h-8 w-3/4 bg-white/30" />
                <Skeleton className="h-4 w-full bg-white/30" />
                <Skeleton className="h-4 w-full bg-white/30" />
              </div>
            </div>
          </div>

          {/* Other Articles Skeletons */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => (
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
        </div>
      </section>
    )
  }

  if ((articles == null || articles.length === 0) && !loading) {
    return (
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Latest News</h2>
        </div>
        <div className="text-center py-12 bg-muted/30 rounded-lg">
          <p className="text-muted-foreground">No latest news available at the moment.</p>
        </div>
      </section>
    )
  }

  return (
    <section>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Latest News</h2>
        <Link
          href="/latest"
          className="group flex items-center text-sm font-medium text-[#CC0000] hover:text-[#AA0000]"
        >
          View All
          <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
      {error && (
        <Alert variant="destructive" className="my-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <div className="grid grid-cols-1 gap-8">
        {/* Featured Article */}
        <FeaturedNewsCard article={articles[0]} />
        {/* Other Articles */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {articles.slice(1, 5).map((article) => (
            <NewsCard key={article.id} article={article} />
          ))}
        </div>
        <div className="text-center mt-4">
          <Button
            variant="outline"
            className="rounded-full border-[#CC0000] text-[#CC0000] hover:bg-[#CC0000]/5 hover:text-[#CC0000]"
            asChild
          >
            <Link href="/latest">View More Latest News</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
