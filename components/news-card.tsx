"use client"
import { formatDistanceToNow } from "date-fns"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Bookmark, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ImageWithFallback } from "@/components/image-with-fallback"
import { OriginalLink } from "@/components/original-link"
import type { NewsArticle } from "@/lib/news-api"
import Link from "next/link"

interface NewsCardProps {
  article: NewsArticle
  featured?: boolean
}

export function NewsCard({ article, featured = false }: NewsCardProps) {
  // Determine fallback image based on source
  const fallbackImage = `/images/sources/${(article.source ? article.source.toLowerCase().replace(/\s+/g, "") : "admin")}-logo.png`

  // If this is an admin news post (no sourceUrl, but has a slug), link to internal article page
  const isAdminNews = !article.sourceUrl && article.slug;
  const internalLink = isAdminNews ? `/news/${article.slug}` : undefined;

  // Only news sources (with sourceUrl) should be clickable
  const isNewsSource = !!article.sourceUrl;

  return (
    <Card
      className={`overflow-hidden group h-full border border-gray-200 dark:border-gray-800 shadow-md hover:shadow-lg transition-shadow duration-300 ${featured ? "rounded-xl" : "rounded-lg"}`}
    >
      <div className="h-full flex flex-col">
        {(isNewsSource) ? (
          <a
            href={article.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block flex-grow"
          >
            <div className="relative">
              <div
                className={`aspect-[16/9] w-full overflow-hidden ${featured ? "aspect-[16/8]" : ""} bg-gray-100 dark:bg-gray-800`}
              >
                <ImageWithFallback
                  src={article.imageUrl || "/placeholder.svg"}
                  fallbackSrc={fallbackImage}
                  alt={article.title}
                  width={featured ? 800 : 400}
                  height={featured ? 450 : 225}
                  className="transition-transform duration-300 group-hover:scale-105"
                  priority={featured}
                />
              </div>
              <Badge className="absolute top-3 left-3 bg-[#CC0000] hover:bg-[#AA0000] shadow-md">
                {typeof article.category === "object" && article.category ? article.category.name : article.category}
              </Badge>
              <div className="absolute top-3 right-3 flex gap-2">
                <Button
                  size="icon"
                  variant="secondary"
                  className="h-8 w-8 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white hidden sm:flex"
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    // Bookmark functionality would go here
                  }}
                >
                  <Bookmark className="h-4 w-4 text-gray-700" />
                  <span className="sr-only">Bookmark</span>
                </Button>
                <Button
                  size="icon"
                  variant="secondary"
                  className="h-8 w-8 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white hidden sm:flex"
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    // Share functionality would go here
                  }}
                >
                  <Share2 className="h-4 w-4 text-gray-700" />
                  <span className="sr-only">Share</span>
                </Button>
              </div>
            </div>
            <CardContent className={`p-4 ${featured ? "p-5" : ""}`}>
              <h3
                className={`font-bold mb-2 line-clamp-2 group-hover:text-[#CC0000] transition-colors ${
                  featured ? "text-xl md:text-2xl" : "text-base sm:text-lg"
                }`}
              >
                {article.title}
              </h3>
              <p className="text-muted-foreground text-xs sm:text-sm mb-3 line-clamp-2">{article.excerpt}</p>
            </CardContent>
          </a>
        ) : isAdminNews ? (
          article.slug ? (
            <a
              href={`/news/${article.slug}`}
              className="block flex-grow"
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="relative">
                <div
                  className={`aspect-[16/9] w-full overflow-hidden ${featured ? "aspect-[16/8]" : ""} bg-gray-100 dark:bg-gray-800`}
                >
                  <ImageWithFallback
                    src={article.imageUrl || "/placeholder.svg"}
                    fallbackSrc={fallbackImage}
                    alt={article.title}
                    width={featured ? 800 : 400}
                    height={featured ? 450 : 225}
                    className="transition-transform duration-300 group-hover:scale-105"
                    priority={featured}
                  />
                </div>
                <Badge className="absolute top-3 left-3 bg-[#CC0000] hover:bg-[#AA0000] shadow-md">
                  {typeof article.category === "object" && article.category ? article.category.name : article.category}
                </Badge>
                <div className="absolute top-3 right-3 flex gap-2">
                  <Button
                    size="icon"
                    variant="secondary"
                    className="h-8 w-8 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white hidden sm:flex"
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      // Bookmark functionality would go here
                    }}
                  >
                    <Bookmark className="h-4 w-4 text-gray-700" />
                    <span className="sr-only">Bookmark</span>
                  </Button>
                  <Button
                    size="icon"
                    variant="secondary"
                    className="h-8 w-8 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white hidden sm:flex"
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      // Share functionality would go here
                    }}
                  >
                    <Share2 className="h-4 w-4 text-gray-700" />
                    <span className="sr-only">Share</span>
                  </Button>
                </div>
              </div>
              <CardContent className={`p-4 ${featured ? "p-5" : ""}`}>
                <h3
                  className={`font-bold mb-2 line-clamp-2 group-hover:text-[#CC0000] transition-colors ${
                    featured ? "text-xl md:text-2xl" : "text-base sm:text-lg"
                  }`}
                >
                  {article.title}
                </h3>
                <p className="text-muted-foreground text-xs sm:text-sm mb-3 line-clamp-2">{article.excerpt}</p>
              </CardContent>
            </a>
          ) : (
            <div className="block flex-grow">
              <div className="relative">
                <div
                  className={`aspect-[16/9] w-full overflow-hidden ${featured ? "aspect-[16/8]" : ""} bg-gray-100 dark:bg-gray-800`}
                >
                  <ImageWithFallback
                    src={article.imageUrl || "/placeholder.svg"}
                    fallbackSrc={fallbackImage}
                    alt={article.title}
                    width={featured ? 800 : 400}
                    height={featured ? 450 : 225}
                    className="transition-transform duration-300 group-hover:scale-105"
                    priority={featured}
                  />
                </div>
                <Badge className="absolute top-3 left-3 bg-[#CC0000] hover:bg-[#AA0000] shadow-md">
                  {typeof article.category === "object" && article.category ? article.category.name : article.category}
                </Badge>
                <div className="absolute top-3 right-3 flex gap-2">
                  <Button
                    size="icon"
                    variant="secondary"
                    className="h-8 w-8 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white hidden sm:flex"
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      // Bookmark functionality would go here
                    }}
                  >
                    <Bookmark className="h-4 w-4 text-gray-700" />
                    <span className="sr-only">Bookmark</span>
                  </Button>
                  <Button
                    size="icon"
                    variant="secondary"
                    className="h-8 w-8 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white hidden sm:flex"
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      // Share functionality would go here
                    }}
                  >
                    <Share2 className="h-4 w-4 text-gray-700" />
                    <span className="sr-only">Share</span>
                  </Button>
                </div>
              </div>
              <CardContent className={`p-4 ${featured ? "p-5" : ""}`}>
                <h3
                  className={`font-bold mb-2 line-clamp-2 group-hover:text-[#CC0000] transition-colors ${
                    featured ? "text-xl md:text-2xl" : "text-base sm:text-lg"
                  }`}
                >
                  {article.title}
                </h3>
                <p className="text-muted-foreground text-xs sm:text-sm mb-3 line-clamp-2">{article.excerpt}</p>
              </CardContent>
            </div>
          )
        ) : (
          <div className="block flex-grow">
            <div className="relative">
              <div
                className={`aspect-[16/9] w-full overflow-hidden ${featured ? "aspect-[16/8]" : ""} bg-gray-100 dark:bg-gray-800`}
              >
                <ImageWithFallback
                  src={article.imageUrl || "/placeholder.svg"}
                  fallbackSrc={fallbackImage}
                  alt={article.title}
                  width={featured ? 800 : 400}
                  height={featured ? 450 : 225}
                  className="transition-transform duration-300 group-hover:scale-105"
                  priority={featured}
                />
              </div>
              <Badge className="absolute top-3 left-3 bg-[#CC0000] hover:bg-[#AA0000] shadow-md">
                {typeof article.category === "object" && article.category ? article.category.name : article.category}
              </Badge>
              <div className="absolute top-3 right-3 flex gap-2">
                <Button
                  size="icon"
                  variant="secondary"
                  className="h-8 w-8 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white hidden sm:flex"
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    // Bookmark functionality would go here
                  }}
                >
                  <Bookmark className="h-4 w-4 text-gray-700" />
                  <span className="sr-only">Bookmark</span>
                </Button>
                <Button
                  size="icon"
                  variant="secondary"
                  className="h-8 w-8 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white hidden sm:flex"
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    // Share functionality would go here
                  }}
                >
                  <Share2 className="h-4 w-4 text-gray-700" />
                  <span className="sr-only">Share</span>
                </Button>
              </div>
            </div>
            <CardContent className={`p-4 ${featured ? "p-5" : ""}`}>
              <h3
                className={`font-bold mb-2 line-clamp-2 group-hover:text-[#CC0000] transition-colors ${
                  featured ? "text-xl md:text-2xl" : "text-base sm:text-lg"
                }`}
              >
                {article.title}
              </h3>
              <p className="text-muted-foreground text-xs sm:text-sm mb-3 line-clamp-2">{article.excerpt}</p>
            </CardContent>
          </div>
        )}
        <div className="px-4 pb-4 mt-auto flex items-center justify-between">
          <div className="flex items-center text-muted-foreground text-xs">
            <span className="font-medium truncate max-w-[80px] sm:max-w-none">{article.source}</span>
            <span className="mx-2 hidden xs:inline">•</span>
            <span className="hidden xs:inline">
              {(() => {
                try {
                  return formatDistanceToNow(new Date(article.publishedAt), { addSuffix: true })
                } catch (e) {
                  return "Recently"
                }
              })()}
            </span>
          </div>
          <OriginalLink href={article.sourceUrl} className="text-xs text-[#CC0000] hover:underline" />
        </div>
      </div>
    </Card>
  )
}
