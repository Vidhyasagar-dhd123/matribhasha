"use client"

import { useBooks } from "../Contexts/BooksContext"

export function Pagination() {
  const { page, setPage, totalPages, totalCount, loading } = useBooks()

  return (
    <div className="flex justify-end items-center gap-2 pt-3">

      <button
        className="px-3 py-1 border border-border rounded-md text-sm disabled:opacity-50"
        disabled={page <= 1 || loading}
        onClick={() => setPage((current) => Math.max(1, current - 1))}
      >
        Prev
      </button>

      <button className="px-3 py-1 bg-primary text-primary-foreground rounded-md">
        {page}
      </button>

      <button className="px-3 py-1 border border-border rounded-md" disabled>
        {totalPages}
      </button>

      <span className="px-2 text-muted-foreground">{totalCount} total</span>

      <button
        className="px-3 py-1 border border-border rounded-md text-sm disabled:opacity-50"
        onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
        disabled={page >= totalPages || loading}
      >
        Next
      </button>

    </div>
  )
}