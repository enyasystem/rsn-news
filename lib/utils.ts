import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Cleans content from CDATA tags and other unwanted elements
 * @param content The HTML content to clean
 * @returns Cleaned HTML content
 */
export function cleanContent(content: string): string {
  if (!content) return ""

  // Remove CDATA sections
  let cleaned = content.replace(/<!\[CDATA\[(.*?)\]\]>/gs, "$1")

  // Remove script tags and their contents
  cleaned = cleaned.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")

  // Remove style tags and their contents
  cleaned = cleaned.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "")

  // Remove iframe tags and their contents
  cleaned = cleaned.replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, "")

  // Remove HTML comments
  cleaned = cleaned.replace(/<!--[\s\S]*?-->/g, "")

  // Remove excessive whitespace
  cleaned = cleaned.replace(/\s+/g, " ").trim()

  return cleaned
}

/**
 * Extracts plain text from HTML content
 * @param html The HTML content
 * @returns Plain text without HTML tags
 */
export function htmlToPlainText(html: string): string {
  if (!html) return ""

  // First clean the content
  const cleaned = cleanContent(html)

  // Then remove all HTML tags
  return cleaned.replace(/<[^>]*>/g, "").trim()
}
