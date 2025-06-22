"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { getArticleBySlug } from "@/lib/news-service"
import { Loader2, ExternalLink, Clock, User, Tag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { ImageWithFallback } from "@/components/image-with-fallback"
import { format } from "date-fns"
import type { NewsArticle } from "@/lib/news-api"

interface ArticlePageProps {
  params: {
    slug: string
  }
}

export default function ArticlePage({ params }: ArticlePageProps) {
  const [article, setArticle] = useState<NewsArticle | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [redirecting, setRedirecting] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        setLoading(true)
        const articleData = await getArticleBySlug(params.slug)

        if (articleData) {
          setArticle(articleData)
        } else {
          setError("Article not found")
        }
      } catch (error) {
        console.error("Error fetching article:", error)
        setError("Failed to load article")
      } finally {
        setLoading(false)
      }
    }

    fetchArticle()
  }, [params.slug])

  const handleRedirect = () => {
    if (article?.sourceUrl) {
      setRedirecting(true)
      window.location.href = article.sourceUrl
    }
  }

  // Determine fallback image based on source
  const getFallbackImage = (source: string) => {
    return `/images/sources/${source.toLowerCase().replace(/\s+/g, "")}-logo.png`
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-[70vh]">
        <Loader2 className="h-16 w-16 animate-spin text-[#CC0000]" />
        <h2 className="text-xl font-medium mt-4">Loading article...</h2>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-[70vh]">
        <Alert variant="destructive" className="max-w-md">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Button className="mt-6" onClick={() => router.push("/")}>
          Back to Home
        </Button>
      </div>
    )
  }

  if (!article) {
    return (
      <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-[70vh]">
        <Alert variant="destructive" className="max-w-md">
          <AlertTitle>Article Not Found</AlertTitle>
          <AlertDescription>The article you're looking for doesn't exist or has been removed.</AlertDescription>
        </Alert>
        <Button className="mt-6" onClick={() => router.push("/")}>
          Back to Home
        </Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Alert className="mb-6 bg-[#CC0000]/10 border-[#CC0000] text-[#CC0000]">
        <AlertTitle className="flex items-center">
          <ExternalLink className="h-4 w-4 mr-2" />
          This article is from {article.source}
        </AlertTitle>
        <AlertDescription>
          You are viewing a preview. For the full article, please{" "}
          <Button variant="link" className="p-0 h-auto text-[#CC0000] font-semibold underline" onClick={handleRedirect}>
            visit the original source
          </Button>
          .
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8">
          <article className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
            <div className="aspect-video w-full relative">
              <ImageWithFallback
                src={article.imageUrl || "/placeholder.svg"}
                fallbackSrc={getFallbackImage(article.source)}
                alt={article.title}
                width={800}
                height={450}
                className="object-cover w-full h-full"
                priority
              />
              <div className="absolute top-4 left-4">
                <Badge className="bg-[#CC0000] hover:bg-[#AA0000]">
                  {typeof article.category === "object" && article.category ? article.category.name : article.category}
                </Badge>
              </div>
            </div>

            <div className="p-6">
              <h1 className="text-2xl sm:text-3xl font-bold mb-4">{article.title}</h1>

              <div className="flex flex-wrap items-center text-sm text-muted-foreground mb-6 gap-y-2">
                <div className="flex items-center mr-4">
                  <User className="h-4 w-4 mr-1" />
                  <span>{article.source}</span>
                </div>
                <div className="flex items-center mr-4">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>
                    {(() => {
                      try {
                        return format(new Date(article.publishedAt), "MMMM d, yyyy")
                      } catch (e) {
                        return "Recently published"
                      }
                    })()}
                  </span>
                </div>
                {article.category && (
                  <div className="flex items-center">
                    <Tag className="h-4 w-4 mr-1" />
                    <span>{typeof article.category === "object" && article.category ? article.category.name : article.category}</span>
                  </div>
                )}
              </div>

              <div className="prose dark:prose-invert max-w-none mb-6">
                <p className="text-lg font-medium mb-4">{article.excerpt}</p>

                {/* Preview of content - limited to avoid showing full article */}
                <div className="line-clamp-6 mb-4">
                  {article.content ? (
                    <div dangerouslySetInnerHTML={{ __html: article.content.substring(0, 500) + "..." }} />
                  ) : (
                    <p>{article.excerpt}</p>
                  )}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  className="bg-[#CC0000] hover:bg-[#AA0000] w-full sm:w-auto"
                  onClick={handleRedirect}
                  disabled={redirecting}
                >
                  {redirecting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Redirecting...
                    </>
                  ) : (
                    <>
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Read Full Article on {article.source}
                    </>
                  )}
                </Button>
                <Button variant="outline" size="lg" className="w-full sm:w-auto" onClick={() => router.push("/")}>
                  Back to Home
                </Button>
              </div>
            </div>
          </article>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <Card>
            <CardContent className="p-4">
              <h3 className="text-lg font-semibold mb-4">About {article.source}</h3>
              <div className="flex items-center mb-4">
                <div className="w-16 h-16 mr-4 overflow-hidden rounded-md">
                  <ImageWithFallback
                    src={getFallbackImage(article.source) || "/placeholder.svg"}
                    fallbackSrc="/placeholder.svg"
                    alt={article.source}
                    width={64}
                    height={64}
                    className="object-contain"
                  />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    {article.source} is a leading Nigerian news source providing up-to-date information on current
                    events.
                  </p>
                </div>
              </div>
              <Button
                className="w-full bg-[#CC0000] hover:bg-[#AA0000]"
                onClick={() => window.open(article.sourceUrl, "_blank")}
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                Visit {article.source}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <h3 className="text-lg font-semibold mb-4">Disclaimer</h3>
              <p className="text-sm text-muted-foreground">
                This content is provided for informational purposes only. The original article can be found on{" "}
                <a
                  href={article.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#CC0000] hover:underline"
                >
                  {article.source}
                </a>
                . RSN NEWS aggregates content from various sources and does not claim ownership of the content.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
