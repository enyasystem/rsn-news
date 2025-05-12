import { parse } from "node-html-parser"
import { decode } from "html-entities"
import { cleanContent, htmlToPlainText } from "@/lib/utils"
import * as cheerio from "cheerio"

// Types for our news data
export interface NewsArticle {
  id: string
  title: string
  slug: string
  excerpt: string
  content?: string
  imageUrl: string
  category: string
  source: string
  sourceUrl: string
  publishedAt: string
  author?: string
}

// Safely parse a date string and return a valid date or fallback
function safeParseDate(dateStr: string, fallback = new Date()): Date {
  if (!dateStr) return fallback

  try {
    const date = new Date(dateStr)
    return !isNaN(date.getTime()) ? date : fallback
  } catch (e) {
    return fallback
  }
}

// News sources configuration with alternative URLs and image selectors
const NEWS_SOURCES = {
  punch: {
    name: "Punch",
    url: "https://punchng.com",
    rssUrls: ["https://punchng.com/feed/", "https://punchng.com/rss/", "https://www.punchng.com/feed/"],
    selectors: {
      articles: "item",
      title: "title",
      link: "link",
      description: "description",
      pubDate: "pubDate",
      content: "content\\:encoded",
      category: "category",
      media: "media\\:content",
      enclosure: "enclosure",
      // Source-specific image selectors for direct scraping
      imageSelectors: [".entry-content img", ".featured-image img", "meta[property='og:image']"],
    },
    defaultImage: "/images/sources/punch-logo.png",
  },
  guardian: {
    name: "Guardian",
    url: "https://guardian.ng",
    rssUrls: ["https://guardian.ng/feed/", "https://www.guardian.ng/feed/"],
    selectors: {
      articles: "item",
      title: "title",
      link: "link",
      description: "description",
      pubDate: "pubDate",
      content: "content\\:encoded",
      category: "category",
      media: "media\\:content",
      enclosure: "enclosure",
      imageSelectors: [".article-featured-image img", ".entry-content img", "meta[property='og:image']"],
    },
    defaultImage: "/images/sources/guardian-logo.png",
  },
  vanguard: {
    name: "Vanguard",
    url: "https://vanguardngr.com",
    rssUrls: ["https://www.vanguardngr.com/feed/", "https://vanguardngr.com/feed/"],
    selectors: {
      articles: "item",
      title: "title",
      link: "link",
      description: "description",
      pubDate: "pubDate",
      content: "content\\:encoded",
      category: "category",
      media: "media\\:content",
      enclosure: "enclosure",
      imageSelectors: ["meta[property='og:image']", ".entry-content img", "img"],
    },
    defaultImage: "/images/sources/vanguard-logo.png",
  },
  channelstv: {
    name: "Channels TV",
    url: "https://channelstv.com",
    rssUrls: ["https://www.channelstv.com/feed/", "https://channelstv.com/feed/"],
    selectors: {
      articles: "item",
      title: "title",
      link: "link",
      description: "description",
      pubDate: "pubDate",
      content: "content\\:encoded",
      category: "category",
      media: "media\\:content",
      enclosure: "enclosure",
      imageSelectors: [".featured-image img", ".entry-content img", "meta[property='og:image']"],
    },
    defaultImage: "/images/sources/channelstv-logo.png",
  },
  premiumtimes: {
    name: "Premium Times",
    url: "https://www.premiumtimesng.com",
    rssUrls: ["https://www.premiumtimesng.com/feed"],
    selectors: {
      articles: "item",
      title: "title",
      link: "link",
      description: "description",
      pubDate: "pubDate",
      content: "content\\:encoded",
      category: "category",
      media: "media\\:content",
      enclosure: "enclosure",
      imageSelectors: [".entry-content img", ".featured-image img", "meta[property='og:image']"],
    },
    defaultImage: "/images/sources/premiumtimes-logo.png",
  },
  // thecable: {
  //   name: "The Cable",
  //   url: "https://www.thecable.ng",
  //   rssUrls: ["https://www.thecable.ng/feed"],
  //   selectors: {
  //     articles: "item",
  //     title: "title",
  //     link: "link",
  //     description: "description",
  //     pubDate: "pubDate",
  //     content: "content:encoded",
  //     category: "category",
  //     media: "media:content",
  //     enclosure: "enclosure",
  //     imageSelectors: ["meta[property='og:image']", ".entry-content img", "img"],
  //   },
  //   defaultImage: "/images/sources/thecable-logo.png",
  // },
  // dailytrust: {
  //   name: "Daily Trust",
  //   url: "https://dailytrust.com",
  //   rssUrls: ["https://dailytrust.com/feed/"],
  //   selectors: {
  //     articles: "item",
  //     title: "title",
  //     link: "link",
  //     description: "description",
  //     pubDate: "pubDate",
  //     content: "content:encoded",
  //     category: "category",
  //     media: "media:content",
  //     enclosure: "enclosure",
  //     imageSelectors: ["meta[property='og:image']", ".entry-content img", "img"],
  //   },
  //   defaultImage: "/images/sources/dailytrust-logo.png",
  // },
  // thisday: {
  //   name: "ThisDay",
  //   url: "https://www.thisdaylive.com",
  //   rssUrls: ["https://www.thisdaylive.com/feed/"],
  //   selectors: {
  //     articles: "item",
  //     title: "title",
  //     link: "link",
  //     description: "description",
  //     pubDate: "pubDate",
  //     content: "content:encoded",
  //     category: "category",
  //     media: "media:content",
  //     enclosure: "enclosure",
  //     imageSelectors: ["meta[property='og:image']", ".entry-content img", "img"],
  //   },
  //   defaultImage: "/images/sources/thisday-logo.png",
  // },
  // saharareporters: {
  //   name: "Sahara Reporters",
  //   url: "https://saharareporters.com",
  //   rssUrls: ["https://saharareporters.com/rss.xml"],
  //   selectors: {
  //     articles: "item",
  //     title: "title",
  //     link: "link",
  //     description: "description",
  //     pubDate: "pubDate",
  //     content: "content:encoded",
  //     category: "category",
  //     media: "media:content",
  //     enclosure: "enclosure",
  //     imageSelectors: ["meta[property='og:image']", ".entry-content img", "img"],
  //   },
  //   defaultImage: "/images/sources/saharareporters-logo.png",
  // },
}

// Cache mechanism to reduce API calls
interface CacheItem {
  data: NewsArticle[]
  timestamp: number
}

const cache: Record<string, CacheItem> = {}
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes in milliseconds

// Image cache to avoid duplicate image searches
const imageCache: Record<string, string> = {}

// Helper to resolve relative URLs to absolute URLs
function resolveImageUrl(url: string, baseUrl: string): string {
  if (!url) return ""
  if (url.startsWith("http://") || url.startsWith("https://")) return url
  if (url.startsWith("//")) return "https:" + url
  if (url.startsWith("/")) {
    try {
      const base = new URL(baseUrl)
      return base.origin + url
    } catch {
      return url
    }
  }
  return url
}

// Helper to resolve relative URLs to absolute URLs
function getAbsoluteUrl(rawLink: string, baseUrl: string): string {
  if (!rawLink) return ""
  if (/^https?:\/\//i.test(rawLink)) return rawLink
  try {
    const base = new URL(baseUrl)
    return new URL(rawLink, base).href
  } catch {
    return rawLink
  }
}

// Helper to fetch canonical or Open Graph URL from article page
async function fetchCanonicalUrl(url: string): Promise<string> {
  try {
    const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0 (compatible; NaijaNewsBot/1.0)' } })
    if (!res.ok) return url
    const html = await res.text()
    // Try <link rel="canonical">
    const canonicalMatch = html.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i)
    if (canonicalMatch && canonicalMatch[1]) {
      const canonicalUrl = canonicalMatch[1]
      if (/^https?:\/\//i.test(canonicalUrl)) return canonicalUrl
      return getAbsoluteUrl(canonicalUrl, url)
    }
    // Try og:url
    const ogUrlMatch = html.match(/<meta[^>]+property=["']og:url["'][^>]+content=["']([^"']+)["']/i)
    if (ogUrlMatch && ogUrlMatch[1]) {
      const ogUrl = ogUrlMatch[1]
      if (/^https?:\/\//i.test(ogUrl)) return ogUrl
      return getAbsoluteUrl(ogUrl, url)
    }
    return url
  } catch {
    return url
  }
}

// Extract image URL from HTML content with enhanced methods
function extractImageFromContent(content: string, baseUrl = ""): string {
  try {
    if (!content) return ""
    const root = parse(content)

    // 1. og:image
    const ogImage = root.querySelector("meta[property='og:image']")
    if (ogImage && ogImage.getAttribute("content")) {
      const src = ogImage.getAttribute("content") || ""
      if (isValidImageUrl(src)) return resolveImageUrl(cleanImageUrl(src), baseUrl)
    }
    // 2. twitter:image
    const twImage = root.querySelector("meta[name='twitter:image']")
    if (twImage && twImage.getAttribute("content")) {
      const src = twImage.getAttribute("content") || ""
      if (isValidImageUrl(src)) return resolveImageUrl(cleanImageUrl(src), baseUrl)
    }
    // 3. First <img src>
    const img = root.querySelector("img[src]")
    if (img && img.getAttribute("src")) {
      const src = img.getAttribute("src") || ""
      if (isValidImageUrl(src)) return resolveImageUrl(cleanImageUrl(src), baseUrl)
    }
    // 4. <img data-src>
    const imgData = root.querySelector("img[data-src]")
    if (imgData && imgData.getAttribute("data-src")) {
      const src = imgData.getAttribute("data-src") || ""
      if (isValidImageUrl(src)) return resolveImageUrl(cleanImageUrl(src), baseUrl)
    }
    // 5. <img data-lazy-src>
    const imgLazy = root.querySelector("img[data-lazy-src]")
    if (imgLazy && imgLazy.getAttribute("data-lazy-src")) {
      const src = imgLazy.getAttribute("data-lazy-src") || ""
      if (isValidImageUrl(src)) return resolveImageUrl(cleanImageUrl(src), baseUrl)
    }
    // 6. <img srcset>
    const imgSet = root.querySelector("img[srcset]")
    if (imgSet && imgSet.getAttribute("srcset")) {
      const srcset = imgSet.getAttribute("srcset") || ""
      const firstSrc = srcset.split(",")[0].split(" ")[0]
      if (isValidImageUrl(firstSrc)) return resolveImageUrl(cleanImageUrl(firstSrc), baseUrl)
    }
    return ""
  } catch (error) {
    console.error("Error extracting image:", error)
    return ""
  }
}

// Clean and normalize image URLs
function cleanImageUrl(url: string): string {
  try {
    // Decode HTML entities in the URL
    let cleanedUrl = decode(url)

    // Remove query parameters that might cause issues
    cleanedUrl = cleanedUrl.split("?")[0]

    // Ensure URL has proper protocol
    if (cleanedUrl.startsWith("//")) {
      cleanedUrl = "https:" + cleanedUrl
    }

    // Handle relative URLs (this is a simplified approach)
    if (cleanedUrl.startsWith("/") && !cleanedUrl.startsWith("//")) {
      // We would need the base URL of the source to properly resolve this
      // For now, we'll just return the URL as is
      return cleanedUrl
    }

    return cleanedUrl
  } catch (error) {
    console.error("Error cleaning image URL:", error)
    return url
  }
}

// Check if URL is a valid image URL
function isValidImageUrl(url: string): boolean {
  if (!url) return false

  // Reject data URLs (too large and often problematic)
  if (url.startsWith("data:")) return false

  // Check if URL ends with common image extensions
  const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg"]
  const lowerUrl = url.toLowerCase()

  // Check for image extensions
  if (imageExtensions.some((ext) => lowerUrl.endsWith(ext))) {
    return true
  }

  // Check for image-like URLs
  if (
    lowerUrl.includes("/wp-content/uploads/") ||
    lowerUrl.includes("/images/") ||
    lowerUrl.includes("/photos/") ||
    lowerUrl.includes("image") ||
    lowerUrl.includes("media") ||
    lowerUrl.includes("thumbnail") ||
    lowerUrl.includes("featured")
  ) {
    return true
  }

  return false
}

// Direct scraping of images from source URLs
async function scrapeImageFromSourceUrl(sourceUrl: string, imageSelectors: string[]): Promise<string> {
  try {
    // Check cache first
    const cacheKey = `scraped-image-${sourceUrl}`
    if (imageCache[cacheKey]) {
      return imageCache[cacheKey]
    }

    const response = await fetch(sourceUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch page: ${response.status}`)
    }

    const html = await response.text()
    const root = parse(html)

    // Try each selector in order
    for (const selector of imageSelectors) {
      if (selector.includes("meta[property=")) {
        // Handle meta tags differently
        const metaTag = root.querySelector(selector)
        if (metaTag && metaTag.getAttribute("content")) {
          const imageUrl = metaTag.getAttribute("content")
          if (imageUrl && isValidImageUrl(imageUrl)) {
            imageCache[cacheKey] = resolveImageUrl(cleanImageUrl(imageUrl), sourceUrl)
            return imageCache[cacheKey]
          }
        }
      } else {
        // Handle regular image elements
        const img = root.querySelector(selector)
        if (img && img.getAttribute("src")) {
          const imageUrl = img.getAttribute("src")
          if (imageUrl && isValidImageUrl(imageUrl)) {
            imageCache[cacheKey] = resolveImageUrl(cleanImageUrl(imageUrl), sourceUrl)
            return imageCache[cacheKey]
          }
        }
      }
    }

    // If we get here, we couldn't find an image with the selectors
    return ""
  } catch (error) {
    console.error(`Error scraping image from ${sourceUrl}:`, error)
    return ""
  }
}

// Fallback: Search for images based on article headline using Unsplash API
async function searchImageByHeadline(headline: string, source: string, unique?: string): Promise<string> {
  // Use a more unique cache key if unique is provided
  const cacheKey = `image-${headline.substring(0, 50)}-${unique || ''}`
  if (imageCache[cacheKey]) {
    return imageCache[cacheKey]
  }
  try {
    // Use a combination of source name, headline, and a unique string for better results
    const keywords = headline
      .split(/\s+/)
      .filter((word) => word.length > 3)
      .slice(0, 3)
      .join(" ")
    // Add a unique string (e.g., article title or slug) to the search term to reduce repeated images
    const searchTerm = `${source} news ${keywords} nigeria ${unique || ''}`.trim()
    // Add a random query param to force Unsplash to return a different image for each article
    const randomParam = `&sig=${encodeURIComponent(unique || headline)}`
    const url = `https://source.unsplash.com/featured/?${encodeURIComponent(searchTerm)}${randomParam}`
    const response = await fetch(url)
    if (response.ok) {
      const imageUrl = response.url
      imageCache[cacheKey] = imageUrl
      return imageUrl
    }
  } catch (error) {
    console.error("Error searching for image:", error)
  }
  // Return source default image if search fails
  return NEWS_SOURCES[source as keyof typeof NEWS_SOURCES]?.defaultImage || "/placeholder.svg"
}

// Helper to fetch the best image from the article page if not present in preview
async function fetchImageUrl(articleUrl: string, fallback: string): Promise<string> {
  try {
    const res = await fetch(articleUrl, { headers: { 'User-Agent': 'Mozilla/5.0 (compatible; NaijaNewsBot/1.0)' } })
    if (!res.ok) return fallback || "/placeholder.svg?height=400&width=600"
    const html = await res.text()
    const $ = cheerio.load(html)
    // Try og:image first
    const ogImg = $('meta[property="og:image"]').attr('content')
    if (ogImg && ogImg.startsWith('http')) return ogImg
    // Try twitter:image
    const twitterImg = $('meta[name="twitter:image"]').attr('content')
    if (twitterImg && twitterImg.startsWith('http')) return twitterImg
    // Try first <img>
    const img = $('img').attr('src')
    if (img && img.startsWith('http')) return img
    return fallback || "/placeholder.svg?height=400&width=600"
  } catch {
    return fallback || "/placeholder.svg?height=400&width=600"
  }
}

// Extract image from RSS item using multiple methods
async function extractImageFromRssItem(
  item: any,
  sourceConfig: any,
  title: string,
  source: string,
  sourceUrl: string,
): Promise<string> {
  // 1. Try <media:content> or <enclosure> in RSS
  const mediaContent = item.querySelector(sourceConfig.selectors.media)
  if (mediaContent && mediaContent.getAttribute("url")) {
    const url = mediaContent.getAttribute("url")
    if (isValidImageUrl(url)) return cleanImageUrl(url)
  }
  const enclosure = item.querySelector(sourceConfig.selectors.enclosure)
  if (enclosure && enclosure.getAttribute("url")) {
    const url = enclosure.getAttribute("url")
    if (isValidImageUrl(url)) return cleanImageUrl(url)
  }
  // 2. Try to extract all <img src> from RSS content/description and pick the first valid one
  const content = item.querySelector(sourceConfig.selectors.content)?.textContent || ""
  const description = item.querySelector(sourceConfig.selectors.description)?.textContent || ""
  const allContent = content + " " + description
  try {
    const root = parse(allContent)
    const imgs = root.querySelectorAll("img[src]")
    for (const img of imgs) {
      let src = img.getAttribute("src") || ""
      if (!src.startsWith("http")) src = resolveImageUrl(src, sourceUrl)
      if (isValidImageUrl(src)) return src
    }
  } catch (e) {
    // ignore parse errors
  }
  // 3. Use cheerio-based fetchImageUrl as a last resort, but only if the image is not a repeated CDN image
  if (sourceUrl) {
    const fetched = await fetchImageUrl(sourceUrl, "")
    // If the fetched image is a repeated CDN image, fallback to Unsplash or logo
    if (fetched && !fetched.includes("/wp-content/uploads/2023/03/IMG-20230318-WA0048.jpg")) {
      return fetched
    }
  }
  // 4. Fallback: Use Unsplash or default logo
  return await searchImageByHeadline(title, source, title)
}

// Helper: fetchWithFallback
async function fetchWithFallback(urls: string[]): Promise<Response> {
  let lastError: Error | null = null
  for (const url of urls) {
    try {
      const response = await fetch(url, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        },
      })
      if (response.ok) return response
      lastError = new Error(`Failed to fetch from URL ${url}: ${response.status}`)
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error))
    }
  }
  throw lastError || new Error("All URLs failed to fetch")
}

// Helper: determineCategory
function determineCategory(categories: string[]): string {
  const categoryMap: Record<string, string> = {
    politics: "Politics",
    business: "Business",
    economy: "Business",
    finance: "Business",
    sport: "Sports",
    sports: "Sports",
    football: "Sports",
    entertainment: "Entertainment",
    lifestyle: "Entertainment",
    tech: "Technology",
    technology: "Technology",
    health: "Health",
    education: "Education",
  }
  for (const category of categories) {
    const lowerCategory = category.toLowerCase()
    for (const [key, value] of Object.entries(categoryMap)) {
      if (lowerCategory.includes(key)) {
        return value
      }
    }
  }
  return "General"
}

// Helper: createSlug
function createSlug(title: string, id: string): string {
  const baseSlug = title
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim()
  const uniqueId = id.replace(/[^\w]/g, "").substring(0, 8)
  return `${baseSlug}-${uniqueId}`
}

// Parse RSS feed
async function parseRSSFeed(source: string): Promise<NewsArticle[]> {
  const sourceConfig = NEWS_SOURCES[source as keyof typeof NEWS_SOURCES]
  if (!sourceConfig) {
    throw new Error(`Source ${source} not configured`)
  }

  try {
    // Try to fetch from multiple URLs with fallback
    const response = await fetchWithFallback(sourceConfig.rssUrls)
    const xmlText = await response.text()

    // Check if the response is valid XML
    if (!xmlText.trim().startsWith("<?xml") && !xmlText.trim().startsWith("<rss")) {
      console.error(`Invalid XML response from ${sourceConfig.name}:`, xmlText.substring(0, 100))
      throw new Error(`Invalid XML response from ${sourceConfig.name}`)
    }

    const root = parse(xmlText)
    const items = root.querySelectorAll(sourceConfig.selectors.articles)

    if (items.length === 0) {
      console.warn(`No articles found in RSS feed for ${sourceConfig.name}`)
      return [] // Return empty array instead of mock articles
    }

    // Process items in parallel for better performance
    const articlePromises = items.map(async (item, index) => {
      const title = item.querySelector(sourceConfig.selectors.title)?.textContent || "Untitled"
      // --- Improved link extraction logic ---
      let rawLink = item.querySelector(sourceConfig.selectors.link)?.textContent?.trim() || ""
      // If <link> is empty, try <guid> if it looks like a URL
      if (!rawLink) {
        const guid = item.querySelector("guid")?.textContent?.trim() || ""
        if (/^https?:\/\//i.test(guid)) {
          rawLink = guid
        }
      }
      // If still empty, try <enclosure url="...">
      if (!rawLink) {
        const enclosureUrl = item.querySelector("enclosure")?.getAttribute("url") || ""
        if (/^https?:\/\//i.test(enclosureUrl)) {
          rawLink = enclosureUrl
        }
      }
      // Always resolve the link to an absolute URL using the source base URL
      let sourceUrl = getAbsoluteUrl(rawLink, sourceConfig.url)
      // Only use canonical/og:url if it is a subpath of the original link and not the homepage
      let canonicalUrl = sourceUrl
      if (sourceUrl && sourceUrl !== sourceConfig.url) {
        const fetchedCanonical = await fetchCanonicalUrl(sourceUrl)
        // Only use canonical if it is not the homepage and contains a path (likely an article)
        if (
          fetchedCanonical &&
          /^https?:\/\//i.test(fetchedCanonical) &&
          ![sourceConfig.url, sourceConfig.url + "/", sourceConfig.url.replace(/\/$/, "")].includes(fetchedCanonical.replace(/\/$/, "")) &&
          fetchedCanonical.replace(sourceConfig.url, "").length > 1 // must have a path after domain
        ) {
          canonicalUrl = fetchedCanonical
        }
      }
      // If the resolved URL is not valid, fallback to the original RSS link (not homepage)
      if (!canonicalUrl || !/^https?:\/\//i.test(canonicalUrl)) {
        canonicalUrl = sourceUrl
      }
      // If still not a valid article link, fallback to homepage as last resort
      if (!canonicalUrl || canonicalUrl === sourceConfig.url || canonicalUrl === sourceConfig.url + "/") {
        canonicalUrl = ""
      }
      // Extract image with enhanced methods, always pass the resolved article URL
      const imageUrl = await extractImageFromRssItem(item, sourceConfig, title, source, canonicalUrl)
      const description = htmlToPlainText(item.querySelector(sourceConfig.selectors.description)?.textContent || "")
      const pubDateStr = item.querySelector(sourceConfig.selectors.pubDate)?.textContent || ""
      let publishedAt = new Date().toISOString() // Default to current date if parsing fails

      // Clean content from CDATA tags
      const content = cleanContent(item.querySelector(sourceConfig.selectors.content)?.textContent || "")

      try {
        // Try to parse the date string
        const parsedDate = new Date(pubDateStr)

        // Check if the date is valid
        if (!isNaN(parsedDate.getTime())) {
          publishedAt = parsedDate.toISOString()
        } else {
          // Try alternative date formats
          // RFC 822 format (common in RSS)
          const rfc822Match = pubDateStr.match(/(\d{1,2}) ([A-Za-z]{3}) (\d{4}) (\d{2}):(\d{2}):(\d{2})/)
          if (rfc822Match) {
            const [, day, month, year, hours, minutes, seconds] = rfc822Match
            const monthMap: Record<string, number> = {
              Jan: 0,
              Feb: 1,
              Mar: 2,
              Apr: 3,
              May: 4,
              Jun: 5,
              Jul: 6,
              Aug: 7,
              Sep: 8,
              Oct: 9,
              Nov: 10,
              Dec: 11,
            }
            const parsedDate = new Date(
              Number.parseInt(year),
              monthMap[month] || 0,
              Number.parseInt(day),
              Number.parseInt(hours),
              Number.parseInt(minutes),
              Number.parseInt(seconds),
            )
            if (!isNaN(parsedDate.getTime())) {
              publishedAt = parsedDate.toISOString()
            }
          }
        }
      } catch (error) {
        console.error(`Error parsing date "${pubDateStr}" from ${sourceConfig.name}:`, error)
        // Keep using the default date
      }

      const categories = item.querySelectorAll(sourceConfig.selectors.category).map((cat) => cat.textContent)

      // Generate a unique ID for this article
      const uniqueId = `${source}-${index}-${Date.now()}`

      // Debug log: print the link and sourceUrl for each article
      console.log(`[NEWS DEBUG] Source: ${sourceConfig.name} | Title: ${title} | link: ${rawLink} | sourceUrl: ${canonicalUrl}`)

      // Log the image URL for debugging
      console.log(`[NEWS DEBUG] Source: ${sourceConfig.name} | Title: ${title} | ImageURL: ${imageUrl}`)

      const category = determineCategory(categories)
      const slug = createSlug(title, uniqueId)

      return {
        id: uniqueId,
        title,
        slug,
        excerpt: description.substring(0, 200) + (description.length > 200 ? "..." : ""),
        content,
        imageUrl,
        category,
        source: sourceConfig.name,
        sourceUrl: canonicalUrl, // Always the best possible article link (by id/path)
        publishedAt,
      }
    })

    return await Promise.all(articlePromises)
  } catch (error) {
    console.error(`Error fetching from ${sourceConfig.name}:`, error)

    // Return empty array instead of mock articles
    return []
  }
}

// Fetch news from a specific source with caching
export async function fetchNewsFromSource(source: string): Promise<NewsArticle[]> {
  // Check cache first
  const cacheKey = `source-${source}`
  const cachedData = cache[cacheKey]
  const now = Date.now()

  if (cachedData && now - cachedData.timestamp < CACHE_DURATION) {
    console.log(`Using cached data for ${source}, age: ${(now - cachedData.timestamp) / 1000}s`)
    return cachedData.data
  }

  try {
    console.log(`Fetching fresh data for ${source}`)
    const articles = await parseRSSFeed(source)

    // Update cache even if empty
    cache[cacheKey] = {
      data: articles,
      timestamp: now,
    }

    return articles
  } catch (error) {
    console.error(`Error fetching news from ${source}:`, error)

    // Return cached data if available, even if expired
    if (cachedData) {
      console.log(`Returning cached data for ${source} due to fetch error`)
      return cachedData.data
    }

    // Return empty array instead of mock articles
    return []
  }
}

// Fetch news from all sources
export async function fetchNewsFromAllSources(): Promise<NewsArticle[]> {
  const cacheKey = "all-sources"
  const cachedData = cache[cacheKey]
  const now = Date.now()

  if (cachedData && now - cachedData.timestamp < CACHE_DURATION) {
    console.log(`Using cached data for all sources, age: ${(now - cachedData.timestamp) / 1000}s`)
    return cachedData.data
  }

  try {
    // Map each source to a promise that resolves to an array of articles
    // If a source fails, log the error and return an empty array
    const sourcePromises = Object.keys(NEWS_SOURCES).map((source) =>
      fetchNewsFromSource(source).catch((error) => {
        console.error(`Error in fetchNewsFromAllSources for source ${source}:`, error)
        return [] // Return empty array for failed sources
      }),
    )

    // Wait for all promises to resolve
    const results = await Promise.all(sourcePromises)

    // Flatten the results into a single array of articles
    const allArticles = results.flat()

    console.log(`Fetched ${allArticles.length} articles from all sources`)

    if (allArticles.length === 0) {
      console.warn("No articles fetched from any source")

      // Return cached data if available
      if (cachedData) {
        console.log("Returning cached data due to no articles fetched")
        return cachedData.data
      }

      // Return empty array if no cached data
      return []
    } else {
      // Sort by published date (newest first)
      allArticles.sort((a, b) => safeParseDate(b.publishedAt).getTime() - safeParseDate(a.publishedAt).getTime())

      // Update cache
      cache[cacheKey] = {
        data: allArticles,
        timestamp: now,
      }
    }

    return allArticles
  } catch (error) {
    console.error("Error in fetchNewsFromAllSources:", error)

    // Return cached data if available, even if expired
    if (cachedData) {
      console.log("Returning cached data due to error")
      return cachedData.data
    }

    // Return empty array if no cached data
    return []
  }
}

// Fetch news by category
export async function fetchNewsByCategory(category: string): Promise<NewsArticle[]> {
  const cacheKey = `category-${category}`
  const cachedData = cache[cacheKey]
  const now = Date.now()

  if (cachedData && now - cachedData.timestamp < CACHE_DURATION) {
    return cachedData.data
  }

  try {
    const allArticles = await fetchNewsFromAllSources()
    const filteredArticles = allArticles.filter((article) => article.category.toLowerCase() === category.toLowerCase())

    // Update cache
    cache[cacheKey] = {
      data: filteredArticles,
      timestamp: now,
    }

    return filteredArticles
  } catch (error) {
    console.error(`Error fetching news for category ${category}:`, error)

    // Return cached data if available, even if expired
    if (cachedData) {
      return cachedData.data
    }

    return []
  }
}

// Search news articles
export async function searchNews(query: string, category?: string, source?: string): Promise<NewsArticle[]> {
  try {
    const allArticles = await fetchNewsFromAllSources()

    return allArticles.filter((article) => {
      // Filter by search query
      const matchesQuery =
        !query ||
        article.title.toLowerCase().includes(query.toLowerCase()) ||
        article.excerpt.toLowerCase().includes(query.toLowerCase())

      // Filter by category
      const matchesCategory =
        !category || category === "all" || article.category.toLowerCase() === category.toLowerCase()

      // Filter by source
      const matchesSource = !source || source === "all" || article.source.toLowerCase() === source.toLowerCase()

      return matchesQuery && matchesCategory && matchesSource
    })
  } catch (error) {
    console.error("Error searching news:", error)
    return []
  }
}

// Get trending news (most recent from all sources)
export async function getTrendingNews(limit = 5): Promise<NewsArticle[]> {
  try {
    // Fetch from all sources and then select the trending ones
    const allArticles = await fetchNewsFromAllSources()

    // In a real app, we would use metrics like view count or engagement
    // For now, we'll just return the most recent articles
    const trendingArticles = [...allArticles].sort((a, b) => {
      return safeParseDate(b.publishedAt).getTime() - safeParseDate(a.publishedAt).getTime()
    })

    return trendingArticles.slice(0, limit)
  } catch (error) {
    console.error("Error getting trending news:", error)
    return [] // Return empty array instead of mock articles
  }
}

// Get article by slug
export async function getArticleBySlug(slug: string): Promise<NewsArticle | null> {
  try {
    const allArticles = await fetchNewsFromAllSources()
    return allArticles.find((article) => article.slug === slug) || null
  } catch (error) {
    console.error(`Error getting article with slug ${slug}:`, error)
    return null
  }
}

// Clear cache for testing or manual refresh
export function clearCache(): void {
  Object.keys(cache).forEach((key) => {
    delete cache[key]
  })
  // Also clear image cache
  Object.keys(imageCache).forEach((key) => {
    delete imageCache[key]
  })
}

export { NEWS_SOURCES }
