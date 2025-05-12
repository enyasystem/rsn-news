// This file now uses in-memory data instead of MongoDB
// We'll use the mock data directly from mock-data.ts

import { mockLatestNews, mockCategoryNews, mockTrendingNews } from "@/lib/mock-data"

// Combined articles from all sources
const allArticles = [...mockLatestNews, ...mockCategoryNews, ...mockTrendingNews]

export async function getArticles(options: {
  category?: string
  source?: string
  limit?: number
  skip?: number
  search?: string
}) {
  const { category, source, limit = 10, skip = 0, search } = options

  // Filter articles based on options
  let filteredArticles = [...allArticles]

  if (category) {
    filteredArticles = filteredArticles.filter((article) => article.category.toLowerCase() === category.toLowerCase())
  }

  if (source) {
    filteredArticles = filteredArticles.filter((article) => article.source.toLowerCase() === source.toLowerCase())
  }

  if (search) {
    const searchLower = search.toLowerCase()
    filteredArticles = filteredArticles.filter(
      (article) =>
        article.title.toLowerCase().includes(searchLower) || article.excerpt.toLowerCase().includes(searchLower),
    )
  }

  // Sort by published date (newest first)
  filteredArticles.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())

  // Apply pagination
  const paginatedArticles = filteredArticles.slice(skip, skip + limit)

  return {
    articles: paginatedArticles,
    total: filteredArticles.length,
  }
}

export async function getArticleBySlug(slug: string) {
  return allArticles.find((article) => article.slug === slug) || null
}

export async function getTrendingArticles(limit = 5) {
  // In a real app, this would use metrics like view count
  // For now, we'll just return the mockTrendingNews
  return mockTrendingNews.slice(0, limit)
}

export async function getLatestArticles(limit = 5) {
  // Sort all articles by date and return the most recent ones
  const sorted = [...allArticles].sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())

  return sorted.slice(0, limit)
}
