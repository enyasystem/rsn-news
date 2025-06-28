import Link from "next/link"
import Image from "next/image"
import { formatDistanceToNow } from "date-fns"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { SearchBar } from "@/components/search-bar"
import { searchNews } from "@/lib/news-service"

interface SearchPageProps {
  searchParams: {
    q?: string
    category?: string
    source?: string
    page?: string
  }
}

export const dynamic = "force-dynamic"

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q, category, source, page = "1" } = searchParams
  const currentPage = Number.parseInt(page, 10) || 1

  // Search articles based on parameters
  const { articles, pagination } =
    q || category || source
      ? await searchNews(q || "", category, source, 12, currentPage)
      : { articles: [], pagination: { total: 0, page: 1, limit: 12, pages: 0 } }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-6">Search Results</h1>
        <SearchBar />
      </div>

      <div className="mb-4">
        <p className="text-muted-foreground">
          {pagination.total} {pagination.total === 1 ? "result" : "results"} found
          {q ? ` for "${q}"` : ""}
          {category && category !== "all" ? ` in ${category}` : ""}
          {source && source !== "all" ? ` from ${source}` : ""}
        </p>
      </div>

      {articles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => (
            <Card
              key={article.id}
              className="overflow-hidden group border border-gray-200 dark:border-gray-800 shadow-md"
            >
              <a href={article.sourceUrl} target="_blank" rel="noopener noreferrer" className="block">
                <div className="aspect-[16/9] w-full overflow-hidden">
                  <Image
                    src={article.imageUrl || "/placeholder.svg?height=225&width=400"}
                    alt={article.title}
                    width={400}
                    height={225}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <CardContent className="p-4">
                  <Badge className="mb-2 bg-[#CC0000] hover:bg-[#AA0000]">
                    {typeof article.category === "string"
                      ? article.category
                      : article.category?.name ?? ""}
                  </Badge>
                  <h3 className="text-lg font-bold mb-2 line-clamp-2 group-hover:text-[#CC0000] transition-colors">
                    {article.title}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-2 line-clamp-2">{article.excerpt}</p>
                  <div className="flex items-center text-muted-foreground text-xs">
                    <span>{article.source}</span>
                    <span className="mx-2">•</span>
                    <span>{formatDistanceToNow(new Date(article.publishedAt), { addSuffix: true })}</span>
                  </div>
                </CardContent>
              </a>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <h3 className="text-xl font-medium mb-2">No results found</h3>
          <p className="text-muted-foreground mb-6">
            Try adjusting your search or filter to find what you're looking for.
          </p>
          <Link href="/" className="text-[#CC0000] hover:underline font-medium">
            Back to homepage
          </Link>
        </div>
      )}

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="flex justify-center mt-8">
          <div className="flex space-x-2">
            {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((pageNum) => (
              <Link
                key={pageNum}
                href={{
                  pathname: "/search",
                  query: {
                    ...searchParams,
                    page: pageNum.toString(),
                  },
                }}
                className={`px-4 py-2 rounded ${
                  pageNum === currentPage
                    ? "bg-[#CC0000] text-white"
                    : "bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
                }`}
              >
                {pageNum}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
