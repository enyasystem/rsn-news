import { LatestNews } from "@/components/latest-news"
import { TrendingNews } from "@/components/trending-news"
import { SearchBar } from "@/components/search-bar"
import { WeatherWidget } from "@/components/weather-widget"
import { ExchangeRatesWidget } from "@/components/exchange-rates-widget"
import { NewsFeed } from "@/components/news-feed"
import { SourceNewsGrid } from "@/components/source-news-grid"

export default async function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <SearchBar />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8">
          <LatestNews />

          <div className="mt-12">
            <NewsFeed />
          </div>

          <div className="mt-12">
            <SourceNewsGrid />
          </div>
        </div>

        <div className="lg:col-span-4 space-y-8">
          <TrendingNews />
          <WeatherWidget />
          <ExchangeRatesWidget />
        </div>
      </div>
    </div>
  )
}
