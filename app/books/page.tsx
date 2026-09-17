"use client"
import { Input } from "@/modules/shared/components/Input"
import { Search, Loader2 } from "lucide-react"
import BookRibbon from "@/modules/books/components/BookRibbon"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Book } from "@/modules/books/utils/books"

const BooksPage = () => {
    const router = useRouter()
    const [books, setBooks] = useState<Book[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const [query, setQuery] = useState("")
    const [debouncedQuery, setDebouncedQuery] = useState("")
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [totalCount, setTotalCount] = useState(0)

    const pageSize = 9

    // Debounce search query
    useEffect(() => {
        const timer = setTimeout(() => setDebouncedQuery(query.trim()), 400)
        return () => clearTimeout(timer)
    }, [query])

    useEffect(() => {
        setPage(1)
    }, [debouncedQuery])

    useEffect(() => {
        const getBooks = async () => {
            setLoading(true)
            const params = new URLSearchParams({
                page: String(page),
                limit: String(pageSize),
            })
            if (debouncedQuery) {
                params.set("search", debouncedQuery)
            }
            const data = await fetch(`/api/v1/books?${params.toString()}`)
            if (data.ok) {
                const payload = await data.json()
                const loadedBooks = Array.isArray(payload) ? payload : payload?.books || []
                setBooks(loadedBooks)
                setTotalPages(
                    Array.isArray(payload)
                        ? Math.max(1, Math.ceil(loadedBooks.length / pageSize))
                        : payload?.totalPages || 1
                )
                setTotalCount(
                    Array.isArray(payload) ? loadedBooks.length : payload?.totalCount || 0
                )
            }
            setLoading(false)
        }
        getBooks()
    }, [page, debouncedQuery])

    return (
        <section className="min-h-screen bg-gradient-to-b from-background to-muted/30 px-4 py-8 sm:px-6 lg:px-8">
            <article className="mx-auto flex w-full max-w-7xl flex-col gap-6">

                {/* Header card */}
                <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                        <div className="max-w-xl space-y-1">
                            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-muted-foreground">Library</p>
                            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                                Find books in any language
                            </h1>
                            <p className="text-sm leading-7 text-muted-foreground">
                                Search by title, author, genre, or language. Open any book to read or start translating.
                            </p>
                        </div>
                        <div className="rounded-xl bg-foreground px-4 py-2.5 text-sm font-semibold text-background">
                            {totalCount} books
                        </div>
                    </div>

                    <div className="mt-5 flex items-center gap-3 rounded-xl border border-border bg-background px-4 py-3">
                        <Search className="h-5 w-5 shrink-0 text-muted-foreground" />
                        <Input
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            className="border-0 bg-transparent p-0 shadow-none focus-visible:ring-0 text-sm"
                            placeholder="Search books, authors, genres, languages…"
                        />
                    </div>
                </div>

                {/* Book grid */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {books.map((book, key) => (
                        <div key={key} className="flex h-full flex-col">
                            <BookRibbon
                                onClick={() => router.push("/books/" + book?.uuid)}
                                book={book}
                            />
                        </div>
                    ))}
                </div>

                {/* Empty state */}
                {!books.length && !loading && (
                    <div className="rounded-2xl border border-dashed border-border bg-card p-12 text-center text-muted-foreground">
                        No books match your search. Try a different title, language, or author.
                    </div>
                )}

                {/* Loading state */}
                {loading && (
                    <div className="flex items-center justify-center gap-3 rounded-2xl border border-border bg-card p-12 text-sm text-muted-foreground">
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Loading books…
                    </div>
                )}

                {/* Pagination */}
                <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border bg-card px-5 py-3 text-sm text-muted-foreground">
                    <div>Page {page} of {totalPages}</div>
                    <div className="flex items-center gap-2">
                        <button
                            className="rounded-lg border border-border px-4 py-2 transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40"
                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                            disabled={page <= 1 || loading}
                        >
                            Previous
                        </button>
                        <button
                            className="rounded-lg border border-border px-4 py-2 transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40"
                            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                            disabled={page >= totalPages || loading}
                        >
                            Next
                        </button>
                    </div>
                </div>
            </article>
        </section>
    )
}

export default BooksPage