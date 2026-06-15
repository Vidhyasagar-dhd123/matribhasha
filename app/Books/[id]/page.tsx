"use client"
import React from "react";
import { useEffect, useMemo, useState } from "react";
import { Book, BookHeaderType, BookStats } from "@/modules/books/utils/books";
import { BookHeader } from "@/modules/books/components/BookHeader";
import BooksStatBar from "@/modules/books/components/BooksStatBar";
import BookTabs from "@/modules/books/components/BookTabs";
import { useAuth } from "@/modules/auth/contexts/authContext";
import { getRequestHeaders } from "@/modules/shared/utils/request";
import Link from "next/link";

function Loading() {
  return <div className="text-center p-10">Loading book details...</div>;
}

function ErrorFallback({ error }: { error: string }) {
  return <div className="text-center p-10 ">{error}</div>;
}

function BookDescription({ params }: { params: Promise<{ id: string }> }) {
  const {id} = React.use(params);
  const [book,setBook] = useState<Book|null>(null)
  const [isLoading,setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [status, setStatus] = useState<string | null>(null)
  const { user } = useAuth()
  const isAdmin = user?.role === "admin"
  const [draft, setDraft] = useState({
    title: "",
    author: "",
    description: "",
    genre: "",
    isbn: "",
    originalLanguage: "",
    coverURI: "",
    uploadURI: "",
  })

  useEffect(()=>{
    const getBook = async()=>{
      setLoading(true)
      const data = await fetch(`/api/v1/books/${id}`)
      if(data.ok){
        const requested_book = await data.json()
        setBook(requested_book)
        setDraft({
          title: requested_book?.title || "",
          author: requested_book?.author || "",
          description: requested_book?.description || "",
          genre: requested_book?.genre || "",
          isbn: requested_book?.isbn13 || requested_book?.isbn || "",
          originalLanguage: requested_book?.originalLanguage || "",
          coverURI: requested_book?.coverURI || "",
          uploadURI: requested_book?.uploadURI || "",
        })
      }
      setLoading(false)
    }
    getBook()
  },[id])

  const stats = useMemo(() => {
    if (!book) {
      return null
    }

    return {
      totalPages: book.pages ? book.pages.length : 0,
      versionCount: book.versions?.length || 0,
      contributors: book.contributors || 0,
    }
  }, [book])

  const saveChanges = async () => {
    if (!book || !isAdmin) {
      return
    }

    setSaving(true)
    setStatus(null)

    try {
      const response = await fetch(`/api/v1/books/${id}`, {
        method: "PUT",
        headers: getRequestHeaders(),
        body: JSON.stringify({
          title: draft.title,
          author: draft.author,
          description: draft.description,
          genre: draft.genre,
          isbn13: draft.isbn,
          originalLanguage: draft.originalLanguage,
          coverURI: draft.coverURI,
          uploadURI: draft.uploadURI,
        }),
      })

      if (!response.ok) {
        throw new Error("Unable to save book changes")
      }

      const updatedBook = await response.json()
      setBook(updatedBook)
      setStatus("Book saved successfully.")
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Unable to save book changes")
    } finally {
      setSaving(false)
    }
  }

  if (!book) {
    return isLoading ? <Loading /> : <ErrorFallback error="Book not found" />;
  }
    const data:BookStats = {
        originalLanguage: book.originalLanguage,
        versions: book.versions,
        contributors: book.contributors,
        totalPages: stats?.totalPages,
    };
    const bookHeader:BookHeaderType={
        title: book.title,
        author: book.author,
        reviews: book.reviews,
        published: book.published,
        workspaceLink:new URL(`/Workspace/${book.uuid}`,window.location.origin),
        link:new URL(`/Read/${book.uuid}`,window.location.origin),
    };
    
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.12),transparent_36%),linear-gradient(180deg,#f8fafc_0%,#eef2ff_100%)] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <div className="flex flex-wrap items-center gap-3 text-sm">
          <Link href="/Books" className="rounded-full border border-slate-200 bg-white px-4 py-2 text-slate-700 transition hover:border-slate-300 hover:bg-slate-50">Back to Books</Link>
          <Link href={`/Read/${book.uuid}`} className="rounded-full border border-slate-200 bg-slate-950 px-4 py-2 text-white transition hover:bg-slate-800">Open Reader</Link>
          <Link href={`/Workspace/${book.uuid}`} className="rounded-full border border-slate-200 bg-white px-4 py-2 text-slate-700 transition hover:border-slate-300 hover:bg-slate-50">Open Workspace</Link>
        </div>
        <BookHeader bookHeader={bookHeader}/>
        <BooksStatBar data={data} />
        <BookTabs/>

        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-[2rem] border border-white/70 bg-white/85 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.25em] text-sky-600">Book editor</p>
                <h2 className="mt-2 text-2xl font-semibold text-slate-950">Edit metadata</h2>
                <p className="mt-2 text-sm leading-7 text-slate-600">
                  {isAdmin ? "Changes are saved directly through the existing book update route." : "Only admin users can save edits, but everyone can inspect the current metadata."}
                </p>
              </div>
              <div className="rounded-2xl bg-slate-950 px-4 py-3 text-sm text-slate-200">
                {stats?.versionCount || 0} versions
              </div>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <label className="space-y-2 text-sm text-slate-700">
                <span>Title</span>
                <input value={draft.title} onChange={(event) => setDraft((current) => ({ ...current, title: event.target.value }))} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none ring-0 transition focus:border-sky-300" disabled={!isAdmin} />
              </label>
              <label className="space-y-2 text-sm text-slate-700">
                <span>Author</span>
                <input value={draft.author} onChange={(event) => setDraft((current) => ({ ...current, author: event.target.value }))} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none ring-0 transition focus:border-sky-300" disabled={!isAdmin} />
              </label>
              <label className="space-y-2 text-sm text-slate-700 sm:col-span-2">
                <span>Description</span>
                <textarea value={draft.description} onChange={(event) => setDraft((current) => ({ ...current, description: event.target.value }))} className="min-h-32 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none ring-0 transition focus:border-sky-300" disabled={!isAdmin} />
              </label>
              <label className="space-y-2 text-sm text-slate-700">
                <span>Genre</span>
                <input value={draft.genre} onChange={(event) => setDraft((current) => ({ ...current, genre: event.target.value }))} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none ring-0 transition focus:border-sky-300" disabled={!isAdmin} />
              </label>
              <label className="space-y-2 text-sm text-slate-700">
                <span>ISBN</span>
                <input value={draft.isbn} onChange={(event) => setDraft((current) => ({ ...current, isbn: event.target.value }))} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none ring-0 transition focus:border-sky-300" disabled={!isAdmin} />
              </label>
              <label className="space-y-2 text-sm text-slate-700">
                <span>Original language</span>
                <input value={draft.originalLanguage} onChange={(event) => setDraft((current) => ({ ...current, originalLanguage: event.target.value }))} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none ring-0 transition focus:border-sky-300" disabled={!isAdmin} />
              </label>
              <label className="space-y-2 text-sm text-slate-700 sm:col-span-2">
                <span>Cover URL</span>
                <input value={draft.coverURI} onChange={(event) => setDraft((current) => ({ ...current, coverURI: event.target.value }))} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none ring-0 transition focus:border-sky-300" disabled={!isAdmin} />
              </label>
              <label className="space-y-2 text-sm text-slate-700 sm:col-span-2">
                <span>Upload URL</span>
                <input value={draft.uploadURI} onChange={(event) => setDraft((current) => ({ ...current, uploadURI: event.target.value }))} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none ring-0 transition focus:border-sky-300" disabled={!isAdmin} />
              </label>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button onClick={saveChanges} disabled={!isAdmin || saving} className="rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60">
                {saving ? "Saving..." : "Save book changes"}
              </button>
              {status ? <p className="text-sm text-slate-600">{status}</p> : null}
            </div>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-950">Book snapshot</h3>
            <div className="mt-4 space-y-3 text-sm text-slate-600">
              <div className="flex justify-between gap-4 border-b border-slate-100 pb-3"><span>Pages</span><span className="font-medium text-slate-900">{stats?.totalPages || 0}</span></div>
              <div className="flex justify-between gap-4 border-b border-slate-100 pb-3"><span>Contributors</span><span className="font-medium text-slate-900">{stats?.contributors || 0}</span></div>
              <div className="flex justify-between gap-4 border-b border-slate-100 pb-3"><span>Primary language</span><span className="font-medium text-slate-900">{book.originalLanguage}</span></div>
              <div className="flex justify-between gap-4 border-b border-slate-100 pb-3"><span>Published</span><span className="font-medium text-slate-900">{book.published}</span></div>
              <div className="flex justify-between gap-4"><span>Genres</span><span className="font-medium text-slate-900">{book.genre || "Not set"}</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookDescription