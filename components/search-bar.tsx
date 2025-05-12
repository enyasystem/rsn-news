"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function SearchBar() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [category, setCategory] = useState("all")
  const [source, setSource] = useState("all")

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()

    // Build query string
    const params = new URLSearchParams()
    if (searchQuery) params.append("q", searchQuery)
    if (category !== "all") params.append("category", category)
    if (source !== "all") params.append("source", source)

    router.push(`/search?${params.toString()}`)
  }

  return (
    <form
      onSubmit={handleSearch}
      className="w-full bg-white dark:bg-gray-800 rounded-lg shadow-md p-3 sm:p-4 border border-gray-200 dark:border-gray-700"
    >
      <div className="flex flex-col gap-3 sm:gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search news..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 border-gray-300 dark:border-gray-600 focus-visible:ring-[#CC0000]"
          />
        </div>

        <div className="flex flex-col xs:flex-row gap-3 sm:gap-4">
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="politics">Politics</SelectItem>
              <SelectItem value="business">Business</SelectItem>
              <SelectItem value="sports">Sports</SelectItem>
              <SelectItem value="entertainment">Entertainment</SelectItem>
              <SelectItem value="technology">Technology</SelectItem>
              <SelectItem value="health">Health</SelectItem>
            </SelectContent>
          </Select>

          <Select value={source} onValueChange={setSource}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Source" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sources</SelectItem>
              <SelectItem value="punch">Punch</SelectItem>
              <SelectItem value="guardian">Guardian</SelectItem>
              <SelectItem value="vanguard">Vanguard</SelectItem>
              <SelectItem value="channelstv">Channels TV</SelectItem>
              <SelectItem value="thecable">The Cable</SelectItem>
              <SelectItem value="premiumtimes">Premium Times</SelectItem>
            </SelectContent>
          </Select>

          <Button type="submit" className="bg-[#CC0000] hover:bg-[#AA0000] w-full xs:w-auto">
            Search
          </Button>
        </div>
      </div>
    </form>
  )
}
