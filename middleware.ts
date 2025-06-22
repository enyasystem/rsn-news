import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Protect /admin routes (except /admin/login and /admin/register)
  if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login") && !pathname.startsWith("/admin/register")) {
    const adminSession = request.cookies.get("admin_session")?.value
    if (!adminSession) {
      return NextResponse.redirect(new URL("/admin-login", request.url))
    }
  }

  // Check if the request is for an article page
  if (pathname.startsWith("/article/")) {
    try {
      // Extract the slug from the pathname
      const slug = pathname.replace("/article/", "")

      // Basic validation - ensure slug is not empty and has a reasonable length
      if (!slug || slug.length < 5 || slug.length > 200) {
        return NextResponse.redirect(new URL("/", request.url))
      }

      // Fetch the article data from our dedicated redirect API
      const response = await fetch(`${request.nextUrl.origin}/api/redirect/${slug}`, {
        headers: {
          "User-Agent": request.headers.get("user-agent") || "",
          Accept: "application/json",
        },
      })

      if (response.ok) {
        const data = await response.json()

        // If we have the sourceUrl, redirect to it
        if (data.sourceUrl) {
          // Add cache control headers to the response
          const redirectResponse = NextResponse.redirect(data.sourceUrl)
          redirectResponse.headers.set("Cache-Control", "s-maxage=3600, stale-while-revalidate=86400")
          return redirectResponse
        }
      }

      // If we couldn't get the sourceUrl, continue to the article page
      // The page itself will handle showing a 404 if needed
      return NextResponse.next()
    } catch (error) {
      console.error("Error in middleware:", error)
      // Continue to the article page on error
      return NextResponse.next()
    }
  }

  // For all other routes, continue normally
  return NextResponse.next()
}

// Configure the middleware to run only for admin and article pages
export const config = {
  matcher: ["/admin/:path*", "/article/:path*"],
}
