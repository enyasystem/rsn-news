"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useTheme } from "next-themes"
import { Menu, Sun, Moon, Search, Bell, Home, TrendingUp, Newspaper, BookOpen, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"

const categories = [
  { name: "Politics", href: "/category/politics" },
  { name: "Business", href: "/category/business" },
  { name: "Sports", href: "/category/sports" },
  { name: "Entertainment", href: "/category/entertainment" },
  { name: "Technology", href: "/category/technology" },
  { name: "Health", href: "/category/health" },
]

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [showSearch, setShowSearch] = useState(false)
  const { theme, setTheme } = useTheme()
  const router = useRouter()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
      setShowSearch(false)
      setSearchQuery("")
    }
  }

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-200",
        isScrolled ? "bg-white dark:bg-gray-900 border-b shadow-sm" : "bg-[#CC0000] dark:bg-[#990000] text-white",
      )}
    >
      {/* Top bar with logo and search */}
      <div className="container mx-auto px-2 sm:px-4">
        <div className="flex h-16 items-center justify-between flex-wrap gap-2 sm:gap-0 min-w-0">
          <div className="flex items-center min-w-0 flex-shrink-0">
            <Link href="/" className="flex items-center min-w-0">
              <div className="flex items-center gap-2 min-w-0">
                <Newspaper className={cn("h-6 w-6 flex-shrink-0", isScrolled ? "text-[#CC0000]" : "text-white")} />
                <span
                  className={cn("text-xl sm:text-2xl font-bold truncate", isScrolled ? "text-[#CC0000] dark:text-white" : "text-white")}
                >
                  RSN NEWS
                  <span className="block text-xs font-normal leading-tight text-gray-200 dark:text-gray-400 truncate max-w-[120px] sm:max-w-none">
                    Beyond Headlines - Your trusted source for Nigerian news and global updates
                  </span>
                </span>
              </div>
            </Link>
          </div>

          <div className="flex items-center space-x-2 flex-shrink-0">
            <Button
              variant={isScrolled ? "ghost" : "secondary"}
              size="icon"
              onClick={() => setShowSearch(!showSearch)}
              className="rounded-full"
            >
              <Search className="h-5 w-5" />
              <span className="sr-only">Search</span>
            </Button>

            <Button variant={isScrolled ? "ghost" : "secondary"} size="icon" className="rounded-full">
              <Bell className="h-5 w-5" />
              <span className="sr-only">Notifications</span>
            </Button>

            <Button
              variant={isScrolled ? "ghost" : "secondary"}
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="rounded-full"
            >
              {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              <span className="sr-only">Toggle theme</span>
            </Button>

            {/* Hamburger menu for mobile */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant={isScrolled ? "ghost" : "secondary"} size="icon" className="md:hidden rounded-full">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[80vw] max-w-xs sm:w-[400px] p-0">
                <div className="flex flex-col gap-6 mt-8">
                  <Link href="/" className="flex items-center gap-2 px-2 py-3 text-lg font-medium hover:text-[#CC0000]">
                    <Home className="h-5 w-5" />
                    Home
                  </Link>
                  <Link
                    href="/trending"
                    className="flex items-center gap-2 px-2 py-3 text-lg font-medium hover:text-[#CC0000]"
                  >
                    <TrendingUp className="h-5 w-5" />
                    Trending
                  </Link>
                  <Link
                    href="/latest"
                    className="flex items-center gap-2 px-2 py-3 text-lg font-medium hover:text-[#CC0000]"
                  >
                    <Newspaper className="h-5 w-5" />
                    Latest News
                  </Link>

                  <div className="border-t my-2 pt-4">
                    <h3 className="px-2 py-2 text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                      Categories
                    </h3>
                    {categories.map((category) => (
                      <Link
                        key={category.name}
                        href={category.href}
                        className="px-2 py-3 text-lg font-medium hover:text-[#CC0000] block mt-1"
                      >
                        {category.name}
                      </Link>
                    ))}
                  </div>

                  <div className="border-t my-2 pt-4">
                    <Link
                      href="/about"
                      className="flex items-center gap-2 px-2 py-3 text-lg font-medium hover:text-[#CC0000]"
                    >
                      <BookOpen className="h-5 w-5" />
                      About
                    </Link>
                    <Link
                      href="/profile"
                      className="flex items-center gap-2 px-2 py-3 text-lg font-medium hover:text-[#CC0000] mt-1"
                    >
                      <User className="h-5 w-5" />
                      Profile
                    </Link>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {showSearch && (
          <div className="py-3 border-t border-white/20">
            <form onSubmit={handleSearch} className="flex gap-2 flex-col sm:flex-row">
              <Input
                type="search"
                placeholder="Search news..."
                className="flex-1 bg-white/20 border-white/20 placeholder:text-white/70 text-white h-10 min-w-0"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
              />
              <Button type="submit" variant="secondary" className="h-10 w-full sm:w-auto">
                Search
              </Button>
            </form>
          </div>
        )}
      </div>

      {/* Navigation bar */}
      <div
        className={cn(
          "bg-[#AA0000] dark:bg-[#770000] py-2 transition-all duration-200",
          isScrolled ? "border-b border-gray-200 dark:border-gray-800" : "",
        )}
      >
        <div className="container mx-auto px-2 sm:px-4">
          {/* Responsive nav: always visible, scrollable on mobile */}
          <nav
            className={cn(
              "flex items-center gap-2 overflow-x-auto flex-nowrap md:justify-between md:overflow-visible scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent"
            )}
            style={{ WebkitOverflowScrolling: 'touch' }}
            aria-label="Main navigation"
          >
            <div className="flex items-center gap-1 flex-nowrap min-w-0">
              <Link
                href="/"
                className="px-3 py-2 text-sm font-medium rounded-md transition-colors hover:bg-white/10 text-white whitespace-nowrap"
              >
                <Home className="h-4 w-4 inline-block mr-1" />
                Home
              </Link>
              <Link
                href="/trending"
                className="px-3 py-2 text-sm font-medium rounded-md transition-colors hover:bg-white/10 text-white whitespace-nowrap"
              >
                <TrendingUp className="h-4 w-4 inline-block mr-1" />
                Trending
              </Link>
              <Link
                href="/latest"
                className="px-3 py-2 text-sm font-medium rounded-md transition-colors hover:bg-white/10 text-white whitespace-nowrap"
              >
                <Newspaper className="h-4 w-4 inline-block mr-1" />
                Latest
              </Link>
              {/* Categories: scrollable on mobile */}
              {categories.map((category) => (
                <Link
                  key={category.name}
                  href={category.href}
                  className="px-3 py-2 text-sm font-medium rounded-md transition-colors hover:bg-white/10 text-white whitespace-nowrap"
                >
                  {category.name}
                </Link>
              ))}
            </div>
          </nav>
        </div>
      </div>
    </header>
  )
}
