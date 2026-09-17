"use client"

import { Input } from "@/modules/shared/components/Input"
import { SearchIcon, ArrowRight, Loader2 } from "lucide-react"
import Link from "next/link"
import { useEffect, useState, useCallback } from "react"
import { Book } from "@/modules/books/utils/books"


export const SearchBar = () => {
    const [query, setQuery] = useState("")
    const [debouncedQuery, setDebouncedQuery] = useState("")
    const [books, setBooks] = useState<Book[]>([])
    const [loading, setLoading] = useState(false)

    // Debounce: only update debouncedQuery 400ms after the user stops typing
    useEffect(() => {
        const timer = setTimeout(() => setDebouncedQuery(query.trim()), 400)
        return () => clearTimeout(timer)
    }, [query])

    const loadBooks = useCallback(async (q: string) => {
        setLoading(true)
        try {
            const params = new URLSearchParams({ limit: "5", page: "1" })
            if (q) params.set("search", q)
            const response = await fetch(`/api/v1/books?${params.toString()}`)
            if (response.ok) {
                const data = await response.json()
                setBooks(Array.isArray(data) ? data : data?.books || [])
            }
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        loadBooks(debouncedQuery)
    }, [debouncedQuery, loadBooks])

    return (
        <div className="w-full rounded-2xl border border-border bg-card p-5 shadow-sm">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                Book search
            </p>
            <div className="flex items-center gap-3 rounded-xl border border-border bg-background px-4 py-3">
                {loading
                    ? <Loader2 className="h-5 w-5 animate-spin text-muted-foreground shrink-0" />
                    : <SearchIcon className="h-5 w-5 text-muted-foreground shrink-0" />
                }
                <Input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="border-0 bg-transparent p-0 shadow-none focus-visible:ring-0 text-sm"
                    placeholder="Search books, authors, languages…"
                />
            </div>
            <div className="mt-4 space-y-2">
                {books.map((book) => (
                    <Link
                        key={book.uuid}
                        href={`/books/${book.uuid}`}
                        className="flex items-center justify-between rounded-xl border border-border bg-background px-4 py-3 text-sm transition hover:bg-muted"
                    >
                        <div>
                            <div className="font-semibold text-foreground">{book.title}</div>
                            <div className="mt-0.5 text-xs text-muted-foreground">{book.author} · {book.originalLanguage}</div>
                        </div>
                        <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                    </Link>
                ))}
                {!loading && !books.length && (
                    <div className="rounded-xl border border-dashed border-border px-4 py-6 text-center text-sm text-muted-foreground">
                        {debouncedQuery ? "No results found. Try a different search." : "Start typing to search books."}
                    </div>
                )}
            </div>
        </div>
    )
}