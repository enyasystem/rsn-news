import type React from "react"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import Header from "@/components/header"
import Footer from "@/components/footer"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "RSN NEWS",
  description: "Beyond Headlines - Your trusted source for Nigerian news and global updates",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/favicon.svg"
  },
  openGraph: {
    title: "RSN NEWS",
    description: "Beyond Headlines - Your trusted source for Nigerian news and global updates",
    images: [
      {
        url: "/placeholder-logo.svg",
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
        url: "/placeholder-logo.svg",
        width: 215,
        height: 48,
        alt: "RSN NEWS Logo"
      }
    ]
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className + " bg-white text-black dark:bg-black dark:text-white min-h-screen antialiased"}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1 w-full max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8 xl:px-10 2xl:px-0">
              {children}
            </main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
