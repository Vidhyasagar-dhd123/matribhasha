"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  BookOpen,
  Search,
  Layers,
  ArrowRight,
  Check,
  Loader2,
  Quote,
  Eye,
} from "lucide-react";
import { getRequestHeaders } from "@/modules/shared/utils/request";
import { useAuth } from "@/modules/auth/contexts/authContext";
import { Book } from "@/modules/books/utils/books";

export default function CreateVivarPage() {
  const router = useRouter();
  const { user } = useAuth();

  // Books and Search filter
  const [books, setBooks] = useState<Book[]>([]);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [loadingBooks, setLoadingBooks] = useState(true);

  // Available pages for the selected book
  const [availablePages, setAvailablePages] = useState<{ pageNumber: number; _id?: string }[]>([]);
  const [selectedPageNum, setSelectedPageNum] = useState<number>(0);
  const [pageContent, setPageContent] = useState<string>("");
  const [language, setLanguage] = useState<string>("en");
  const [loadingPage, setLoadingPage] = useState(false);

  // Quote and Caption
  const [selectedText, setSelectedText] = useState("");
  const [caption, setCaption] = useState("");
  const [posting, setPosting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Fetch all books
  useEffect(() => {
    let isMounted = true;
    const fetchBooks = async () => {
      setLoadingBooks(true);
      try {
        const res = await fetch("/api/v1/books");
        if (res.ok && isMounted) {
          const data = await res.json();
          const list = Array.isArray(data) ? data : [];
          setBooks(list);
          if (list.length > 0) {
            setSelectedBook(list[0]);
            setLanguage(list[0].originalLanguage || "en");
          }
        }
      } catch (err) {
        console.error("Error loading books:", err);
      } finally {
        if (isMounted) setLoadingBooks(false);
      }
    };
    fetchBooks();
    return () => {
      isMounted = false;
    };
  }, []);

  // Fetch available pages when book changes
  useEffect(() => {
    if (!selectedBook?.uuid) return;
    let isMounted = true;
    const loadBookPages = async () => {
      try {
        const res = await fetch(`/api/v1/books/${selectedBook.uuid}/pages`);
        if (res.ok && isMounted) {
          const pagesData = await res.json();
          if (Array.isArray(pagesData) && pagesData.length > 0) {
            setAvailablePages(pagesData);
            setSelectedPageNum(pagesData[0].pageNumber);
          } else {
            setAvailablePages([]);
            setSelectedPageNum(0);
          }
        }
      } catch (err) {
        console.error("Error loading book pages:", err);
      }
    };
    loadBookPages();
    return () => {
      isMounted = false;
    };
  }, [selectedBook?.uuid]);

  // Fetch page content when book, pageNumber, or language changes
  useEffect(() => {
    if (!selectedBook?.uuid) return;
    let isMounted = true;
    const fetchPage = async () => {
      setLoadingPage(true);
      setError(null);
      try {
        const res = await fetch(
          `/api/v1/pages/${selectedBook.uuid}/${selectedPageNum}?language=${encodeURIComponent(language)}`
        );
        if (res.ok && isMounted) {
          const data = await res.json();
          setPageContent(data?.content || "");
          if (!selectedText) {
            // Pick a default snippet if empty
            const words = (data?.content || "").slice(0, 180);
            if (words) setSelectedText(words);
          }
        } else if (isMounted) {
          setPageContent("No text recorded for this page in the selected language.");
        }
      } catch {
        if (isMounted) setPageContent("Unable to load page content.");
      } finally {
        if (isMounted) setLoadingPage(false);
      }
    };
    fetchPage();
    return () => {
      isMounted = false;
    };
  }, [selectedBook?.uuid, selectedPageNum, language]);

  // Filtered books
  const filteredBooks = books.filter(
    (b) =>
      b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle Text Selection from the page preview
  const handleTextSelect = () => {
    const selection = window.getSelection();
    if (selection) {
      const text = selection.toString().trim();
      if (text.length > 5) {
        setSelectedText(text);
      }
    }
  };

  // Submit Vivar Reel
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setError("Please login to publish Vivar reels.");
      return;
    }
    if (!selectedBook || !selectedText.trim()) {
      setError("Please select a quote from the text.");
      return;
    }

    setPosting(true);
    setError(null);

    try {
      const res = await fetch("/api/v1/vivar", {
        method: "POST",
        headers: getRequestHeaders(true),
        body: JSON.stringify({
          selectedText: selectedText.trim(),
          caption: caption.trim(),
          bookUUID: selectedBook.uuid,
          pageNumber: selectedPageNum,
          language: language || selectedBook.originalLanguage || "en",
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "Failed to create Vivar reel");
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/vivar");
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error creating Vivar reel");
    } finally {
      setPosting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-6">
        {/* Top Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500">
              <Sparkles size={22} />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-foreground">
                Vivar Studio · Create Reel
              </h1>
              <p className="text-xs text-muted-foreground">
                Search books, select meaningful passages, and publish scrollable quote reels
              </p>
            </div>
          </div>

          <Link
            href="/vivar"
            className="rounded-full border border-border bg-card px-4 py-2 text-xs font-semibold text-foreground hover:bg-muted transition"
          >
            &larr; Back to Vivar Reels
          </Link>
        </div>

        {/* Studio Grid: Filters & Page Selector on Left, Quote Form & Live Preview on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* LEFT COLUMN: Book & Page Explorer */}
          <div className="lg:col-span-6 space-y-4">
            <div className="rounded-2xl border border-border bg-card p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-primary">
                  1. Choose Book & Page
                </span>
                <span className="text-xs text-muted-foreground">
                  {books.length} Books Available
                </span>
              </div>

              {/* Book Search Bar */}
              <div className="relative">
                <Search
                  size={15}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                />
                <input
                  type="text"
                  placeholder="Search book by title or author..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-xl border border-input bg-background pl-9 pr-3 py-2 text-xs text-foreground outline-none focus:border-primary"
                />
              </div>

              {/* Book Selection Dropdown / List */}
              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                {loadingBooks ? (
                  <div className="py-6 text-center text-xs text-muted-foreground">
                    <Loader2 className="mx-auto h-5 w-5 animate-spin text-primary mb-2" />
                    Loading library books...
                  </div>
                ) : filteredBooks.length > 0 ? (
                  filteredBooks.map((b) => (
                    <button
                      key={b.uuid}
                      type="button"
                      onClick={() => {
                        setSelectedBook(b);
                        setSelectedPageNum(1);
                        setLanguage(b.originalLanguage || "en");
                      }}
                      className={`w-full text-left p-2.5 rounded-xl border text-xs transition flex items-center justify-between ${
                        selectedBook?.uuid === b.uuid
                          ? "bg-primary/10 border-primary text-foreground font-semibold"
                          : "border-border/60 hover:bg-muted/50 text-muted-foreground"
                      }`}
                    >
                      <div className="truncate pr-2">
                        <p className="font-bold text-foreground truncate">{b.title}</p>
                        <p className="text-[11px] text-muted-foreground">by {b.author}</p>
                      </div>
                      <span className="rounded bg-muted px-2 py-0.5 text-[10px] font-mono font-bold uppercase shrink-0">
                        {b.originalLanguage}
                      </span>
                    </button>
                  ))
                ) : (
                  <div className="py-4 text-center text-xs text-muted-foreground">
                    No books matched your query.
                  </div>
                )}
              </div>

              {/* Page Number & Language Selector */}
              {selectedBook && (
                <div className="grid grid-cols-2 gap-3 pt-2 border-t border-border/60">
                  <div>
                    <label className="text-[11px] font-semibold text-muted-foreground block mb-1">
                      Page Number:
                    </label>
                    {availablePages.length > 0 ? (
                      <select
                        value={selectedPageNum}
                        onChange={(e) => setSelectedPageNum(Number(e.target.value))}
                        className="w-full rounded-xl border border-input bg-background px-2.5 py-1.5 text-xs font-bold text-foreground outline-none focus:border-primary"
                      >
                        {availablePages.map((p) => (
                          <option key={p.pageNumber} value={p.pageNumber}>
                            Page {p.pageNumber}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type="number"
                        min={0}
                        value={selectedPageNum}
                        onChange={(e) => setSelectedPageNum(Math.max(0, Number(e.target.value)))}
                        className="w-full rounded-xl border border-input bg-background px-3 py-1.5 text-xs font-bold text-foreground outline-none focus:border-primary"
                      />
                    )}
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-muted-foreground block mb-1">
                      Language:
                    </label>
                    <select
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                      className="w-full rounded-xl border border-input bg-background px-2.5 py-1.5 text-xs font-bold text-foreground outline-none focus:border-primary"
                    >
                      <option value="en">English (en)</option>
                      <option value="hin">Hindi (hin)</option>
                      <option value="mr">Marathi (mr)</option>
                      <option value="bn">Bengali (bn)</option>
                      <option value="te">Telugu (te)</option>
                      <option value="ta">Tamil (ta)</option>
                      <option value="gu">Gujarati (gu)</option>
                      <option value="kn">Kannada (kn)</option>
                      <option value="ml">Malayalam (ml)</option>
                      <option value="pa">Punjabi (pa)</option>
                      <option value="or">Odia (or)</option>
                      <option value="ur">Urdu (ur)</option>
                    </select>
                  </div>
                </div>
              )}
            </div>

            {/* Page Reading Text Box (Selectable) */}
            <div className="rounded-2xl border border-border bg-card p-5 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-primary">
                  2. Highlight / Select Text
                </span>
                <span className="text-[11px] text-muted-foreground">
                  Select text below to automatically set the quote
                </span>
              </div>

              <div
                onMouseUp={handleTextSelect}
                className="rounded-xl border border-input bg-background p-4 min-h-[160px] max-h-[220px] overflow-y-auto text-xs sm:text-sm font-serif leading-relaxed text-foreground select-text"
              >
                {loadingPage ? (
                  <div className="flex items-center justify-center py-8 text-muted-foreground gap-2">
                    <Loader2 size={16} className="animate-spin text-primary" />
                    <span>Loading page content...</span>
                  </div>
                ) : (
                  pageContent || "No text available for this page."
                )}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Quote Editor & Live Reel Preview */}
          <div className="lg:col-span-6 space-y-4">
            <form
              onSubmit={handleSubmit}
              className="rounded-2xl border border-border bg-card p-5 shadow-sm space-y-4"
            >
              <div className="flex items-center justify-between border-b border-border pb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-primary">
                  3. Quote & Reflection
                </span>
                <span className="text-xs text-muted-foreground">Live Reel Preview Below</span>
              </div>

              {/* Quote Editor */}
              <div>
                <label className="text-xs font-semibold text-foreground block mb-1">
                  Selected Excerpt / Quote: *
                </label>
                <textarea
                  required
                  rows={3}
                  value={selectedText}
                  onChange={(e) => setSelectedText(e.target.value)}
                  placeholder="Select text on the left or type your passage here..."
                  className="w-full rounded-xl border border-input bg-background p-3 text-xs sm:text-sm font-serif leading-relaxed text-foreground outline-none focus:border-primary transition"
                />
              </div>

              {/* Caption */}
              <div>
                <label className="text-xs font-semibold text-foreground block mb-1">
                  Your Reflection or Thought (Optional):
                </label>
                <input
                  type="text"
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="e.g. A poignant look at justice and compassion..."
                  className="w-full rounded-xl border border-input bg-background px-3 py-2 text-xs sm:text-sm text-foreground outline-none focus:border-primary transition"
                />
              </div>

              {error && (
                <p className="text-xs text-destructive bg-destructive/10 p-2.5 rounded-xl">
                  {error}
                </p>
              )}

              {success && (
                <div className="flex items-center gap-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 p-3 text-xs font-semibold">
                  <Check size={16} />
                  <span>Vivar Reel successfully published! Redirecting to feed...</span>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={posting || !user || !selectedText.trim()}
                className="w-full rounded-xl bg-primary py-2.5 text-xs sm:text-sm font-bold text-primary-foreground shadow-sm hover:bg-primary/90 transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {posting ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
                <span>{user ? "Publish to Vivar Reels" : "Login to Publish"}</span>
              </button>
            </form>

            {/* LIVE CARD PREVIEW */}
            <div className="rounded-2xl border border-border bg-gradient-to-b from-amber-500/15 via-orange-500/10 to-rose-500/15 p-6 shadow-xl relative overflow-hidden flex flex-col justify-between min-h-[260px]">
              <Quote className="absolute -bottom-4 -right-4 h-32 w-32 text-foreground/5 pointer-events-none" />

              <div className="flex items-center justify-between z-10">
                <span className="rounded-full bg-primary/20 text-primary text-[10px] font-bold px-2.5 py-0.5 uppercase font-mono">
                  {language}
                </span>
                <span className="text-xs text-muted-foreground">
                  Page {selectedPageNum}
                </span>
              </div>

              <div className="my-auto z-10 space-y-2 py-4">
                <blockquote className="text-base sm:text-lg font-serif italic text-foreground leading-relaxed">
                  &ldquo;{selectedText || "Your chosen quote will appear beautifully rendered here."}&rdquo;
                </blockquote>
                {caption && (
                  <p className="text-xs text-foreground/80 font-sans border-l-2 border-primary/50 pl-2">
                    {caption}
                  </p>
                )}
              </div>

              <div className="z-10 pt-3 border-t border-border/40 flex items-center justify-between text-xs text-muted-foreground">
                <span className="font-bold text-foreground truncate max-w-[200px]">
                  {selectedBook?.title || "Book Title"}
                </span>
                <span>By @{user?.username || user?.name || "you"}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
