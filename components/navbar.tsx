"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/latest", label: "Latest" },
  { href: "/trending", label: "Trending" },
  { href: "/category/politics", label: "Politics" },
  { href: "/category/business", label: "Business" },
  { href: "/category/sports", label: "Sports" },
  { href: "/category/entertainment", label: "Entertainment" },
  { href: "/category/technology", label: "Technology" },
  { href: "/search", label: "Search" }
]

export function Navbar() {
  const pathname = usePathname()
  return (
    <nav className="flex gap-4 py-4 px-6 bg-white shadow-md">
      {navLinks.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={`text-sm font-medium px-3 py-2 rounded transition-colors ${
            pathname === link.href
              ? "bg-[#CC0000]/10 text-[#CC0000]"
              : "text-gray-700 hover:bg-gray-100"
          }`}
        >
          {link.label}
        </Link>
      ))}
    </nav>
  )
}
