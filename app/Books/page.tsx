"use client"
import { Input } from "@/modules/shared/components/Input"
import { Search } from "lucide-react"
import BookRibbon from "@/modules/books/components/BookRibbon"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Book } from "@/modules/books/utils/books"

const Books = () =>{
    const router = useRouter()
    const [Books, setBooks] = useState<Book[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const [query, setQuery] = useState("")
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [totalCount, setTotalCount] = useState(0)

    const pageSize = 9

    useEffect(()=>{
        const getBooks = async()=>{
            setLoading(true)
            const params = new URLSearchParams({
                page: String(page),
                limit: String(pageSize),
            })

            if (query.trim()) {
                params.set("search", query.trim())
            }

            const data = await fetch(`/api/v1/books?${params.toString()}`)
            if(data.ok){
                const payload = await data.json()
                const loaded_books = Array.isArray(payload) ? payload : payload?.books || []
                setBooks(loaded_books)
                setTotalPages(Array.isArray(payload) ? Math.max(1, Math.ceil(loaded_books.length / pageSize)) : payload?.totalPages || 1)
                setTotalCount(Array.isArray(payload) ? loaded_books.length : payload?.totalCount || 0)
            }
            setLoading(false)
        }
        getBooks()
    },[page, query])

    return (
        <section className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(244,114,182,0.12),transparent_35%),linear-gradient(180deg,#fff7fb_0%,#f8fafc_55%,#eef2ff_100%)] px-4 py-8 sm:px-6 lg:px-8">
            <article className="mx-auto flex w-full max-w-7xl flex-col gap-8">
                <div className="rounded-[2rem] border border-white/80 bg-white/80 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                        <div className="max-w-2xl space-y-2">
                            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-pink-600">Library search</p>
                            <h1 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">Find books by title, author, language, or genre</h1>
                            <p className="text-sm leading-7 text-slate-600">
                                Search now filters the live catalog, making it easy to jump into a reading workspace or open a book detail view.
                            </p>
                        </div>
                        <div className="rounded-2xl bg-slate-950 px-4 py-3 text-sm text-slate-200">
                            {totalCount} books total
                        </div>
                    </div>

                    <div className="mt-6 flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                        <Search className="h-5 w-5 text-slate-500" />
                        <Input
                            value={query}
                            onChange={(event) => {
                                setQuery(event.target.value)
                                setPage(1)
                            }}
                            className="border-0 bg-transparent p-0 shadow-none focus-visible:ring-0"
                            placeholder="Search books, authors, genres, languages..."
                        />
                    </div>
                </div>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {Books && Books.map((value,key)=>{
                        return <div key={key} className="flex h-full flex-col"><BookRibbon onClick={()=>{router.push("/Books/"+value?.uuid)}} book={value}></BookRibbon></div>
                    })}
                    
                </div>
                {
                    !(Books?.length>0) && !loading &&
                    <div className="w-full text-center">
                        <div className="m-10 rounded-[2rem] border border-dashed border-slate-300 bg-white/70 p-10 text-slate-600 shadow-sm md:m-16">
                            No books match your search yet. Try a different title, language, or author.
                        </div>
                    </div>
                }
                {
                    loading &&
                    <div className="w-full text-center">
                        <div className="m-10 rounded-[2rem] border border-slate-200 bg-white/80 p-10 text-slate-600 shadow-sm md:m-16">
                            Loading...
                        </div>
                    </div>
                }

                <div className="flex flex-wrap items-center justify-between gap-4 rounded-[1.5rem] border border-slate-200 bg-white/80 px-4 py-3 text-sm text-slate-600 shadow-sm">
                    <div>
                        Page {page} of {totalPages}
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            className="rounded-full border border-slate-200 px-4 py-2 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                            onClick={() => setPage((current) => Math.max(1, current - 1))}
                            disabled={page <= 1 || loading}
                        >
                            Previous
                        </button>
                        <button
                            className="rounded-full border border-slate-200 px-4 py-2 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                            onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
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

export default Books