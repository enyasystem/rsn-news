"use client"

import { useState, useEffect } from "react"
import { formatDistanceToNow } from "date-fns"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { TrendingUpIcon as TrendUp, AlertCircle, RefreshCw } from "lucide-react"
import { fetchTrendingNews } from "@/lib/news-service"
import { Button } from "@/components/ui/button"
import { OriginalLink } from "@/components/original-link"
import type { NewsArticle } from "@/lib/news-api"

export function TrendingNews() {
  const [articles, setArticles] = useState<NewsArticle[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [refreshing, setRefreshing] = useState(false)

  const loadTrendingNews = async () => {
    setLoading(true)
    setError(null)
    try {
      console.log("TrendingNews: Loading trending news")
      const data = await fetchTrendingNews(5)

      if (data.length === 0) {
        console.warn("TrendingNews: No trending articles found")
        setError("No trending articles available at the moment.")
      }

      setArticles(data)
    } catch (error) {
      console.error("Error fetching trending news:", error)
      setError("Failed to load trending news.")
    } finally {
      setLoading(false)
    }
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    await loadTrendingNews()
    setRefreshing(false)
  }

  useEffect(() => {
    loadTrendingNews()
  }, [])

  return (
    <Card className="border border-gray-200 dark:border-gray-800 shadow-md overflow-hidden">
      <CardHeader className="bg-[#CC0000] text-white py-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl flex items-center">
            <TrendUp className="mr-2 h-5 w-5" />
            Trending in Nigeria
          </CardTitle>
          {!loading && (
            <Button
              variant="secondary"
              size="sm"
              onClick={handleRefresh}
              disabled={refreshing}
              className="h-8 w-8 p-0 rounded-full"
            >
              <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
              <span className="sr-only">Refresh</span>
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {loading ? (
          <div className="p-4 space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-start gap-4">
                <Skeleton className="h-8 w-8 rounded-full" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-3 w-3/4" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <Alert variant="destructive" className="m-4 border-none">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : (
          <ul className="divide-y">
            {articles.length > 0 ? (
              articles.map((article, index) => (
                <li key={article.id} className="relative">
                  {/* Use direct link to original source */}
                  <a
                    href={article.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block p-4 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-start gap-4">
                      <span className="text-2xl font-bold text-[#CC0000] leading-none">{index + 1}</span>
                      <div>
                        <h3 className="font-medium line-clamp-2 group-hover:text-[#CC0000] transition-colors">
                          {article.title}
                        </h3>
                        <div className="flex items-center justify-between mt-1">
                          <div className="flex items-center text-muted-foreground text-xs">
                            <span className="font-medium">{article.source}</span>
                            <span className="mx-2">•</span>
                            <span>
                              {(() => {
                                try {
                                  return formatDistanceToNow(new Date(article.publishedAt), { addSuffix: true })
                                } catch (e) {
                                  return "Recently"
                                }
                              })()}
                            </span>
                          </div>
                          <OriginalLink
                            href={article.sourceUrl}
                            className="text-xs text-[#CC0000] hover:underline"
                            onClick={(e) => e.stopPropagation()}
                          />
                        </div>
                      </div>
                    </div>
                  </a>
                </li>
              ))
            ) : (
              <li className="p-6 text-center">
                <p className="text-muted-foreground">No trending articles available.</p>
              </li>
            )}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}
