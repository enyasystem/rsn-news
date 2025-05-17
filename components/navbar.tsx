"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { CATEGORIES } from "@/lib/categories"

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/latest", label: "Latest" },
  { href: "/trending", label: "Trending" },
  ...CATEGORIES.map(cat => ({
    href: `/category/${cat.slug}`,
    label: cat.name
  })),
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
