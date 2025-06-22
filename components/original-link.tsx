"use client"

import type React from "react"

import { ExternalLink } from "lucide-react"
import { cn } from "@/lib/utils"

interface OriginalLinkProps {
  href: string
  className?: string
  iconClassName?: string
  children?: React.ReactNode
  onClick?: (e: React.MouseEvent) => void
  asSpan?: boolean // If true, render as <span> instead of <a>
}

export function OriginalLink({ href, className, iconClassName, children, onClick, asSpan }: OriginalLinkProps) {
  const handleClick = (e: React.MouseEvent) => {
    // Prevent event bubbling if onClick is provided
    if (onClick) {
      e.stopPropagation()
      onClick(e)
    }
  }

  if (asSpan) {
    return (
      <span
        className={cn("flex items-center hover:underline cursor-pointer", className)}
        onClick={handleClick}
      >
        <ExternalLink className={cn("h-3 w-3 mr-1", iconClassName)} />
        {children || "Original"}
      </span>
    )
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn("flex items-center hover:underline", className)}
      onClick={handleClick}
    >
      <ExternalLink className={cn("h-3 w-3 mr-1", iconClassName)} />
      {children || "Original"}
    </a>
  )
}
