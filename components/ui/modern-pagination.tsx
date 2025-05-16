import React from "react"

interface PaginationProps {
  currentPage: number
  totalCount: number
  pageSize: number
  onPageChange: (page: number) => void
}

export const ModernPagination: React.FC<PaginationProps> = ({ currentPage, totalCount, pageSize, onPageChange }) => {
  const totalPages = Math.ceil(totalCount / pageSize)
  if (totalPages <= 1) return null

  const getPages = () => {
    const pages = []
    const maxShown = 5
    let start = Math.max(1, currentPage - 2)
    let end = Math.min(totalPages, start + maxShown - 1)
    if (end - start < maxShown - 1) start = Math.max(1, end - maxShown + 1)
    for (let i = start; i <= end; i++) pages.push(i)
    return pages
  }

  return (
    <nav className="flex gap-2 items-center" aria-label="Pagination">
      <button
        className="px-3 py-1 rounded border bg-white disabled:opacity-50"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        Previous
      </button>
      {getPages().map((page) => (
        <button
          key={page}
          className={`px-3 py-1 rounded border ${page === currentPage ? "bg-[#CC0000] text-white" : "bg-white"}`}
          onClick={() => onPageChange(page)}
        >
          {page}
        </button>
      ))}
      <button
        className="px-3 py-1 rounded border bg-white disabled:opacity-50"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Next
      </button>
    </nav>
  )
}
