"use client"

import { formatDistanceToNow } from "date-fns"
import { Badge } from "@/components/ui/badge"
import { Bookmark, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ImageWithFallback } from "@/components/image-with-fallback"
import { OriginalLink } from "@/components/original-link"
import type { NewsArticle } from "@/lib/news-api"

interface FeaturedNewsCardProps {
  article: NewsArticle
}

export function FeaturedNewsCard({ article }: FeaturedNewsCardProps) {
  // Determine fallback image based on source
  const fallbackImage = `/images/sources/${(article.source ? article.source.toLowerCase().replace(/\s+/g, "") : "admin")}-logo.png`

  return (
    <div className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
      {/* Always link to the original source */}
      <a href={article.sourceUrl} target="_blank" rel="noopener noreferrer" className="block">
        <div className="aspect-[16/9] sm:aspect-[16/8] w-full overflow-hidden bg-gray-100 dark:bg-gray-800">
          <ImageWithFallback
            src={article.imageUrl || "/placeholder.svg"}
            fallbackSrc={fallbackImage}
            alt={article.title}
            width={800}
            height={450}
            className="transition-transform duration-300 group-hover:scale-105"
            priority
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

        <div className="absolute top-3 left-3 sm:top-4 sm:left-4">
          <Badge className="bg-[#CC0000] hover:bg-[#AA0000] shadow-md text-xs sm:text-sm px-2 py-0.5 sm:px-3 sm:py-1">
            {article.category}
          </Badge>
        </div>

        <div className="absolute top-3 right-3 sm:top-4 sm:right-4 flex gap-2">
          <Button
            size="icon"
            variant="secondary"
            className="h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white hidden sm:flex"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              // Bookmark functionality would go here
            }}
          >
            <Bookmark className="h-3 w-3 sm:h-4 sm:w-4 text-gray-700" />
            <span className="sr-only">Bookmark</span>
          </Button>
          <Button
            size="icon"
            variant="secondary"
            className="h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white hidden sm:flex"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              // Share functionality would go here
            }}
          >
            <Share2 className="h-3 w-3 sm:h-4 sm:w-4 text-gray-700" />
            <span className="sr-only">Share</span>
          </Button>
        </div>

        <div className="absolute bottom-0 p-3 sm:p-4 md:p-6">
          <h3 className="text-lg sm:text-xl md:text-3xl font-bold text-white mb-1 sm:mb-2 group-hover:text-[#ffcccc] transition-colors line-clamp-2 sm:line-clamp-3">
            {article.title}
          </h3>
          <p className="text-white/90 text-xs sm:text-sm md:text-base mb-2 sm:mb-3 line-clamp-2 max-w-3xl">
            {article.excerpt}
          </p>
          <div className="flex items-center justify-between">
            <div className="flex items-center text-white/80 text-xs sm:text-sm">
              <span className="font-medium">{article.source}</span>
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
            <OriginalLink
              href={article.sourceUrl}
              className="text-white/90 hover:text-white text-xs sm:text-sm"
              iconClassName="text-white/90"
            >
              <span className="hidden xs:inline">Read Original</span>
              <span className="xs:hidden">Original</span>
            </OriginalLink>
          </div>
        </div>
      </a>
    </div>
  )
}
