"use client"

import { Input } from "@/modules/shared/components/Input"
import { SearchIcon, ArrowRight } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { Book } from "@/modules/books/utils/books"


export const SearchBar = () =>{
    const [query, setQuery] = useState("")
    const [books, setBooks] = useState<Book[]>([])

    useEffect(() => {
        const loadBooks = async () => {
            const params = new URLSearchParams({ search: query.trim(), limit: "5", page: "1" })
            const response = await fetch(`/api/v1/books?${params.toString()}`)
            if (response.ok) {
                const data = await response.json()
                setBooks(Array.isArray(data) ? data : data?.books || [])
            }
        }

        loadBooks()
    }, [query])

    return (
        <div className="w-full rounded-[2rem] border border-white/80 bg-white/90 p-5 shadow-[0_20px_50px_rgba(15,23,42,0.08)] backdrop-blur lg:max-w-xl">
            <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                <SearchIcon className="h-5 w-5 text-slate-500" />
                <Input value={query} onChange={(event) => setQuery(event.target.value)} className="border-0 bg-transparent p-0 shadow-none focus-visible:ring-0" placeholder="Search across books and translations"/>
            </div>
            <div className="mt-4 space-y-3">
                {books.map((book) => (
                    <Link key={book.uuid} href={`/Books/${book.uuid}`} className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3 transition hover:border-slate-300 hover:bg-slate-50">
                        <div>
                            <div className="text-sm font-semibold text-slate-950">{book.title}</div>
                            <div className="text-xs text-slate-500">{book.author} · {book.originalLanguage}</div>
                        </div>
                        <ArrowRight className="h-4 w-4 text-slate-400" />
                    </Link>
                ))}
                {!books.length ? (
                    <div className="rounded-2xl border border-dashed border-slate-300 px-4 py-6 text-sm text-slate-500">
                        No results yet. Try a different title or language.
                    </div>
                ) : null}
            </div>
        </div>
    )
}