"use client"

import { useState, useEffect } from "react"
import { NewsCard } from "@/components/news-card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { RefreshCw, AlertCircle } from "lucide-react"
import { fetchLatestNews } from "@/lib/news-service"
import type { NewsArticle } from "@/lib/news-api"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export function NewsFeed() {
  // Dynamically require NEWS_SOURCES to avoid undefined on SSR
  const NEWS_SOURCES = require("@/lib/news-api").NEWS_SOURCES
  // Add type assertion for config to avoid 'unknown' type error
  const allSources = Object.entries(NEWS_SOURCES).map(([id, config]) => ({ id, name: (config as { name: string }).name }))
  const [articles, setArticles] = useState<NewsArticle[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeSource, setActiveSource] = useState("all")
  const [refreshing, setRefreshing] = useState(false)
  const [availableSources, setAvailableSources] = useState<string[]>(allSources.map(s => s.id))

  const loadNews = async (source = "all") => {
    setLoading(true)
    setError(null)
    try {
      console.log(`NewsFeed: Loading news from ${source}`)
      const data = await fetchLatestNews(source)

      if (data.length === 0 && source !== "all") {
        console.warn(`NewsFeed: No articles found from ${source}`)
        setError(`No articles available from ${source} at the moment.`)
      }

      setArticles(data)
    } catch (error) {
      console.error("NewsFeed: Error fetching news:", error)
      setError("Failed to load news. Please try again later.")
    } finally {
      setLoading(false)
    }
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    await loadNews(activeSource)
    setRefreshing(false)
  }

  useEffect(() => {
    loadNews(activeSource)
  }, [activeSource])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Latest News Feed</h2>
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          disabled={refreshing || loading}
          className="flex items-center gap-1"
        >
          <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
          {refreshing ? "Refreshing..." : "Refresh"}
        </Button>
      </div>

      <Tabs defaultValue="all" onValueChange={setActiveSource}>
        <TabsList className="mb-6 bg-muted/80 p-1">
          <TabsTrigger key="all" value="all" className="capitalize">All Sources</TabsTrigger>
          {allSources.map((source) => (
            <TabsTrigger key={source.id} value={source.id} className="capitalize">
              {source.name}
            </TabsTrigger>
          ))}
        </TabsList>

        {["all", ...allSources.map(s => s.id)].map((source) => (
          <TabsContent key={source} value={source} className="mt-0">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
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
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {articles.length > 0 ? (
                  articles.map((article) => (
                    <a key={article.id} href={article.sourceUrl} target="_blank" rel="noopener noreferrer" className="block">
                      <NewsCard article={article} />
                    </a>
                  ))
                ) : (
                  <div className="col-span-full text-center py-12">
                    <p className="text-muted-foreground">
                      {source === "all"
                        ? "No articles available at the moment. Please try again later."
                        : `No articles available from this source at the moment.`}
                    </p>
                  </div>
                )}
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
