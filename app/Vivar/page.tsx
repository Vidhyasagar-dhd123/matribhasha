"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { BookOpen, Heart, RefreshCcw, Send, Sparkles } from "lucide-react"
import { getRequestHeaders } from "@/modules/shared/utils/request"
import { useAuth } from "@/modules/auth/contexts/authContext"
import { Book } from "@/modules/books/utils/books"

type VivarPost = {
  _id: string
  selectedText: string
  caption?: string
  bookUUID: string
  bookTitle: string
  pageNumber: number
  language: string
  likesCount: number
  createdAt: string
  authorId?: {
    name?: string
    email?: string
  }
}

export default function VivarPage() {
  const { user } = useAuth()
  const [books, setBooks] = useState<Book[]>([])
  const [posts, setPosts] = useState<VivarPost[]>([])
  const [selectedBook, setSelectedBook] = useState("")
  const [pageNumber, setPageNumber] = useState("1")
  const [language, setLanguage] = useState("")
  const [selectedText, setSelectedText] = useState("")
  const [caption, setCaption] = useState("")
  const [status, setStatus] = useState<string | null>(null)
  const [loadingPosts, setLoadingPosts] = useState(true)
  const [posting, setPosting] = useState(false)

  const activeBook = useMemo(
    () => books.find((book) => book.uuid === selectedBook),
    [books, selectedBook]
  )

  useEffect(() => {
    const loadBooks = async () => {
      const response = await fetch("/api/v1/books")
      if (response.ok) {
        const data = await response.json()
        setBooks(data)
        if (data[0]) {
          setSelectedBook(data[0].uuid)
          setLanguage(data[0].originalLanguage || "")
        }
      }
    }

    loadBooks()
    loadPosts()
  }, [])

  const loadPosts = async () => {
    setLoadingPosts(true)
    const response = await fetch("/api/v1/vivar")
    if (response.ok) {
      setPosts(await response.json())
    }
    setLoadingPosts(false)
  }

  const publishPost = async () => {
    if (!user) {
      setStatus("Please log in before posting.")
      return
    }

    if (!selectedBook || !pageNumber || !language || !selectedText.trim()) {
      setStatus("Book, page, language, and selected text are required.")
      return
    }

    setPosting(true)
    setStatus(null)

    try {
      const response = await fetch("/api/v1/vivar", {
        method: "POST",
        headers: getRequestHeaders(),
        body: JSON.stringify({
          bookUUID: selectedBook,
          pageNumber,
          language,
          selectedText,
          caption,
        }),
      })
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data?.message || "Unable to publish Vivar post.")
      }

      setPosts((current) => [data, ...current])
      setSelectedText("")
      setCaption("")
      setStatus("Posted to Vivar.")
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Unable to publish Vivar post.")
    } finally {
      setPosting(false)
    }
  }

  const toggleLike = async (postId: string) => {
    if (!user) {
      setStatus("Please log in to like posts.")
      return
    }

    const response = await fetch(`/api/v1/vivar/${postId}/like`, {
      method: "POST",
      headers: getRequestHeaders(),
    })

    if (response.ok) {
      const data = await response.json()
      setPosts((current) =>
        current.map((post) =>
          post._id === postId ? { ...post, likesCount: data.likesCount } : post
        )
      )
    }
  }

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#f8fafc_0%,#ecfeff_100%)] px-4 py-6 sm:px-6 lg:px-8">
      <section className="mx-auto grid w-full max-w-7xl gap-6 lg:grid-cols-[380px_1fr]">
        <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:sticky lg:top-24">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-cyan-50 p-2 text-cyan-700">
              <Sparkles size={20} />
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-slate-950">Vivar</h1>
              <p className="text-sm text-slate-600">Post a selected book excerpt.</p>
            </div>
          </div>

          <div className="mt-5 space-y-4">
            <label className="block text-sm text-slate-700">
              <span className="mb-2 block font-medium">Book</span>
              <select
                value={selectedBook}
                onChange={(event) => {
                  const book = books.find((item) => item.uuid === event.target.value)
                  setSelectedBook(event.target.value)
                  setLanguage(book?.originalLanguage || "")
                }}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-3 outline-none focus:border-cyan-400"
              >
                {books.map((book) => (
                  <option key={book.uuid} value={book.uuid}>
                    {book.title}
                  </option>
                ))}
              </select>
            </label>

            <div className="grid grid-cols-2 gap-3">
              <label className="block text-sm text-slate-700">
                <span className="mb-2 block font-medium">Page</span>
                <input
                  type="number"
                  min="0"
                  value={pageNumber}
                  onChange={(event) => setPageNumber(event.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-3 outline-none focus:border-cyan-400"
                />
              </label>
              <label className="block text-sm text-slate-700">
                <span className="mb-2 block font-medium">Language</span>
                <input
                  value={language}
                  onChange={(event) => setLanguage(event.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-3 outline-none focus:border-cyan-400"
                />
              </label>
            </div>

            <label className="block text-sm text-slate-700">
              <span className="mb-2 block font-medium">Selected text</span>
              <textarea
                value={selectedText}
                onChange={(event) => setSelectedText(event.target.value)}
                className="min-h-40 w-full resize-none rounded-lg border border-slate-200 bg-white px-3 py-3 leading-7 outline-none focus:border-cyan-400"
                placeholder="Paste the selected passage here..."
              />
            </label>

            <label className="block text-sm text-slate-700">
              <span className="mb-2 block font-medium">Caption</span>
              <input
                value={caption}
                onChange={(event) => setCaption(event.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-3 outline-none focus:border-cyan-400"
                placeholder="Optional note"
              />
            </label>

            <button
              onClick={publishPost}
              disabled={posting || !selectedText.trim()}
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Send size={16} />
              {posting ? "Posting..." : "Post to Vivar"}
            </button>

            {status ? <p className="text-sm text-slate-600">{status}</p> : null}
            {activeBook ? (
              <Link href={`/Read/${activeBook.uuid}`} className="inline-flex items-center gap-2 text-sm font-medium text-cyan-700 hover:text-cyan-900">
                <BookOpen size={16} />
                Open selected book
              </Link>
            ) : null}
          </div>
        </aside>

        <div className="min-h-[80vh]">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-semibold text-slate-950">Post scroller</h2>
              <p className="text-sm text-slate-600">Newest selections appear first.</p>
            </div>
            <button
              onClick={loadPosts}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              <RefreshCcw size={16} />
              Refresh
            </button>
          </div>

          <div className="snap-y space-y-5">
            {loadingPosts ? (
              <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-600">
                Loading Vivar posts...
              </div>
            ) : posts.length ? (
              posts.map((post) => (
                <article
                  key={post._id}
                  className="snap-start rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold text-cyan-700">{post.bookTitle}</p>
                      <h3 className="mt-1 text-lg font-semibold text-slate-950">
                        Page {post.pageNumber} · {post.language}
                      </h3>
                      <p className="mt-1 text-sm text-slate-500">
                        {post.authorId?.name || "Matribhasha reader"}
                      </p>
                    </div>
                    <button
                      onClick={() => toggleLike(post._id)}
                      className="inline-flex items-center gap-2 rounded-lg border border-rose-100 bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-700 hover:bg-rose-100"
                    >
                      <Heart size={16} />
                      {post.likesCount || 0}
                    </button>
                  </div>

                  <blockquote className="mt-5 border-l-4 border-cyan-400 pl-4 text-xl leading-9 text-slate-900">
                    {post.selectedText}
                  </blockquote>

                  {post.caption ? (
                    <p className="mt-4 rounded-lg bg-slate-50 p-3 text-sm leading-6 text-slate-600">
                      {post.caption}
                    </p>
                  ) : null}
                </article>
              ))
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-600">
                No Vivar posts yet.
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  )
}
