import type React from "react"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import RootLayoutClient from "@/components/root-layout-client"
import { Toaster } from "@/components/ui/toaster";
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "RSN NEWS",
  description: "Beyond Headlines - Your trusted source for Nigerian news and global updates",
  icons: {
    icon: "/RSN NEWS.jpg",
    shortcut: "/RSN NEWS.jpg",
    apple: "/RSN NEWS.jpg"
  },
  openGraph: {
    title: "RSN NEWS",
    description: "Beyond Headlines - Your trusted source for Nigerian news and global updates",
    images: [
      {
        url: "/RSN NEWS.jpg",
        width: 215,
        height: 48,
        alt: "RSN NEWS Logo"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "RSN NEWS",
    description: "Beyond Headlines - Your trusted source for Nigerian news and global updates",
    images: [
      {
        url: "/RSN NEWS.jpg",
        width: 215,
        height: 48,
        alt: "RSN NEWS Logo"
      }
    ]
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className + " bg-white text-black dark:bg-black dark:text-white min-h-screen antialiased"}>
        <RootLayoutClient>
          {children}
          <Toaster />
        </RootLayoutClient>
      </body>
    </html>
  )
}
