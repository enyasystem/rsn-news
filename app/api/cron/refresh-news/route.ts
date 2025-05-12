import { NextResponse } from "next/server"
import { clearCache, fetchNewsFromAllSources } from "@/lib/news-api"

// This route would be triggered by Vercel Cron
export async function GET() {
  try {
    // Clear the cache
    clearCache()

    // Fetch fresh news to populate the cache
    const articles = await fetchNewsFromAllSources()

    return NextResponse.json({
      success: true,
      message: "News cache refreshed successfully",
      timestamp: new Date().toISOString(),
      articlesCount: articles.length,
    })
  } catch (error) {
    console.error("Error refreshing news cache:", error)

    return NextResponse.json(
      {
        success: false,
        message: "Failed to refresh news cache",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
