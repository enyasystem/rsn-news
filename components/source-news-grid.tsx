"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { fetchLatestNews } from "@/lib/news-service"
import { ImageWithFallback } from "@/components/image-with-fallback"
import { OriginalLink } from "@/components/original-link"
import type { NewsArticle } from "@/lib/news-api"
import { NEWS_SOURCES } from "@/lib/news-api"

export function SourceNewsGrid() {
  const sources = Object.entries(NEWS_SOURCES).map(([id, config]) => ({ id, name: config.name }))
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [sourceNews, setSourceNews] = useState<Record<string, NewsArticle[]>>(() => {
    const initial: Record<string, NewsArticle[]> = {}
    sources.forEach((s) => { initial[s.id] = [] })
    return initial
  })
  const [availableSources, setAvailableSources] = useState<string[]>([])

  useEffect(() => {
    const loadAllSourceNews = async () => {
      setLoading(true)
      setError(null)
      try {
        const newsPromises = sources.map((source) => fetchLatestNews(source.id, 3))
        const results = await Promise.all(newsPromises)

        const newsMap: Record<string, NewsArticle[]> = {}
        const availableSources: string[] = []

        sources.forEach((source, index) => {
          newsMap[source.id] = results[index]
          // Only include sources that have articles
          if (results[index].length > 0) {
            availableSources.push(source.id)
          }
        })

        setSourceNews(newsMap)
        setAvailableSources(availableSources)
      } catch (error) {
        console.error("Error fetching source news:", error)
        setError("Failed to load news from sources. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    loadAllSourceNews()
  }, [])

  // Filter sources to only show those with articles
  const availableSourcesData = sources.filter((source) => availableSources.includes(source.id))

  if (error) {
    return (
      <Alert variant="destructive" className="my-6">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  // If no sources have articles, don't show the component
  if (!loading && availableSources.length === 0) {
    return null
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">News by Source</h2>

      {availableSourcesData.length > 0 ? (
        <Tabs defaultValue={availableSourcesData[0].id}>
          <TabsList className="mb-6 bg-muted/80 p-1">
            {availableSourcesData.map((source) => (
              <TabsTrigger key={source.id} value={source.id}>
                {source.name}
              </TabsTrigger>
            ))}
          </TabsList>

          {availableSourcesData.map((source) => (
            <TabsContent key={source.id} value={source.id} className="mt-0">
              <Card className="border border-gray-200 dark:border-gray-800 shadow-md">
                <CardHeader className="bg-gray-100 dark:bg-gray-800">
                  <CardTitle className="flex items-center justify-between">
                    <span>Latest from {source.name}</span>
                    <a
                      href={NEWS_SOURCES[source.id as keyof typeof NEWS_SOURCES]?.url || "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-[#CC0000] hover:underline"
                    >
                      Visit Website
                    </a>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="space-y-3">
                          <Skeleton className="h-32 w-full rounded" />
                          <Skeleton className="h-5 w-4/5" />
                          <Skeleton className="h-4 w-full" />
                          <Skeleton className="h-4 w-3/4" />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {sourceNews[source.id]?.length > 0 ? (
                        sourceNews[source.id].map((article) => (
                          <div key={article.id} className="group">
                            <a href={article.sourceUrl} target="_blank" rel="noopener noreferrer" className="block">
                              <div className="aspect-[16/9] w-full overflow-hidden rounded mb-2 bg-gray-100 dark:bg-gray-800">
                                <ImageWithFallback
                                  src={article.imageUrl || "/placeholder.svg"}
                                  fallbackSrc={`/images/sources/${source.id}-logo.png`}
                                  alt={article.title}
                                  width={300}
                                  height={169}
                                  className="transition-transform duration-300 group-hover:scale-105"
                                />
                              </div>
                              <h3 className="font-medium line-clamp-2 group-hover:text-[#CC0000] transition-colors">
                                {article.title}
                              </h3>
                            </a>
                            <div className="flex items-center justify-between mt-2">
                              <p className="text-xs text-muted-foreground">
                                {(() => {
                                  try {
                                    return formatDistanceToNow(new Date(article.publishedAt), { addSuffix: true })
                                  } catch (e) {
                                    return "Recently"
                                  }
                                })()}
                              </p>
                              <OriginalLink
                                href={article.sourceUrl}
                                className="text-xs text-[#CC0000] hover:underline"
                              />
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="col-span-3 text-center py-6">
                          <p className="text-muted-foreground">No articles available from this source.</p>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      ) : (
        <div className="text-center py-12 bg-muted/30 rounded-lg">
          <p className="text-muted-foreground">No source news available at the moment. Please try again later.</p>
        </div>
      )}
    </div>
  )
}
