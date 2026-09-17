"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Book, BookHeaderType, BookStats } from "@/modules/books/utils/books";
import { BookHeader } from "@/modules/books/components/BookHeader";
import BooksStatBar from "@/modules/books/components/BooksStatBar";
import BookTabs from "@/modules/books/components/BookTabs";
import { ReadProvider } from "@/modules/books/contexts/read.context";
import { useAuth } from "@/modules/auth/contexts/authContext";
import { getRequestHeaders } from "@/modules/shared/utils/request";
import Link from "next/link";
import { Settings2, BookOpen, Layers, Edit3, Loader2 } from "lucide-react";

function Loading() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center text-muted-foreground">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );
}

function ErrorFallback({ error }: { error: string }) {
  return (
    <div className="mx-auto max-w-md py-16 text-center text-destructive">
      <p className="text-lg font-semibold">{error}</p>
      <Link href="/books" className="mt-4 inline-block text-sm text-primary hover:underline">
        &larr; Back to Catalog
      </Link>
    </div>
  );
}

function BookDescription({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const [book, setBook] = useState<Book | null>(null);
  const [isLoading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [showAdminEditor, setShowAdminEditor] = useState(false);
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  const [draft, setDraft] = useState({
    title: "",
    author: "",
    description: "",
    genre: "",
    isbn: "",
    originalLanguage: "",
    coverURI: "",
    uploadURI: "",
  });

  useEffect(() => {
    const getBook = async () => {
      setLoading(true);
      try {
        const data = await fetch(`/api/v1/books/${id}`);
        if (data.ok) {
          const requested_book = await data.json();
          setBook(requested_book);
          setDraft({
            title: requested_book?.title || "",
            author: requested_book?.author || "",
            description: requested_book?.description || "",
            genre: requested_book?.genre || "",
            isbn: requested_book?.isbn13 || requested_book?.isbn || "",
            originalLanguage: requested_book?.originalLanguage || "",
            coverURI: requested_book?.coverURI || "",
            uploadURI: requested_book?.uploadURI || "",
          });
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    getBook();
  }, [id]);

  const stats = useMemo(() => {
    if (!book) return null;
    return {
      totalPages: book.pages ? book.pages.length : 0,
      versionCount: book.versions?.length || 0,
      contributors: book.contributors || 0,
    };
  }, [book]);

  const saveChanges = async () => {
    if (!book || !isAdmin) return;

    setSaving(true);
    setStatus(null);

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
      });

      if (!response.ok) {
        throw new Error("Unable to save book changes");
      }

      const updatedBook = await response.json();
      setBook(updatedBook);
      setStatus("Book metadata updated successfully.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Unable to save book changes");
    } finally {
      setSaving(false);
    }
  };

  if (!book) {
    return isLoading ? <Loading /> : <ErrorFallback error="Book not found" />;
  }

  const data: BookStats = {
    originalLanguage: book.originalLanguage,
    versions: stats?.versionCount || 0,
    contributors: book.contributors,
    totalPages: stats?.totalPages,
  };

  const bookHeader: BookHeaderType = {
    title: book.title,
    author: book.author,
    reviews: book.reviews,
    published: book.published,
    coverURI: book.coverURI,
    genre: book.genre,
    description: book.description,
    originalLanguage: book.originalLanguage,
    workspaceLink: new URL(`/workspace/${book.uuid}`, typeof window !== "undefined" ? window.location.origin : "http://localhost:3000"),
    link: new URL(`/read/${book.uuid}`, typeof window !== "undefined" ? window.location.origin : "http://localhost:3000"),
  };

  return (
    <ReadProvider id={id}>
      <div className="min-h-screen bg-background text-foreground px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
          {/* Action Navigation */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm">
              <Link
                href="/books"
                className="rounded-full border border-border bg-card px-4 py-2 text-foreground transition hover:bg-muted font-medium"
              >
                &larr; Catalog
              </Link>
              <Link
                href={`/read/${book.uuid}`}
                className="rounded-full bg-primary px-4 py-2 text-primary-foreground font-semibold shadow-sm transition hover:bg-primary/90 inline-flex items-center gap-1.5"
              >
                <BookOpen size={15} />
                <span>Open Reader</span>
              </Link>
              <Link
                href={`/workspace/${book.uuid}`}
                className="rounded-full border border-border bg-card px-4 py-2 text-foreground transition hover:bg-muted font-medium inline-flex items-center gap-1.5"
              >
                <Layers size={15} />
                <span>Translate in Studio</span>
              </Link>
            </div>

            {isAdmin && (
              <button
                onClick={() => setShowAdminEditor(!showAdminEditor)}
                className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/60 px-4 py-2 text-xs font-semibold text-foreground hover:bg-muted transition"
              >
                <Settings2 size={14} />
                <span>{showAdminEditor ? "Hide Metadata Editor" : "Edit Book Metadata"}</span>
              </button>
            )}
          </div>

          <BookHeader bookHeader={bookHeader} />
          <BooksStatBar data={data} />
          <BookTabs />

          {/* Admin Metadata Modal / Expandable Section */}
          {isAdmin && showAdminEditor && (
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <div className="flex items-center justify-between gap-4 border-b border-border pb-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-primary">
                    Curator / Admin Controls
                  </p>
                  <h2 className="mt-1 text-xl font-bold text-foreground">Edit Metadata</h2>
                </div>
                <div className="rounded-xl bg-muted px-3 py-1.5 text-xs font-semibold text-foreground">
                  {stats?.versionCount || 0} versions recorded
                </div>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <label className="space-y-1 text-xs font-medium text-muted-foreground">
                  <span>Title</span>
                  <input
                    value={draft.title}
                    onChange={(event) =>
                      setDraft((current) => ({ ...current, title: event.target.value }))
                    }
                    className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm text-foreground outline-none transition focus:border-primary"
                  />
                </label>
                <label className="space-y-1 text-xs font-medium text-muted-foreground">
                  <span>Author</span>
                  <input
                    value={draft.author}
                    onChange={(event) =>
                      setDraft((current) => ({ ...current, author: event.target.value }))
                    }
                    className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm text-foreground outline-none transition focus:border-primary"
                  />
                </label>
                <label className="space-y-1 text-xs font-medium text-muted-foreground sm:col-span-2">
                  <span>Description</span>
                  <textarea
                    value={draft.description}
                    onChange={(event) =>
                      setDraft((current) => ({ ...current, description: event.target.value }))
                    }
                    className="min-h-24 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm text-foreground outline-none transition focus:border-primary"
                  />
                </label>
                <label className="space-y-1 text-xs font-medium text-muted-foreground">
                  <span>Genre</span>
                  <input
                    value={draft.genre}
                    onChange={(event) =>
                      setDraft((current) => ({ ...current, genre: event.target.value }))
                    }
                    className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm text-foreground outline-none transition focus:border-primary"
                  />
                </label>
                <label className="space-y-1 text-xs font-medium text-muted-foreground">
                  <span>ISBN</span>
                  <input
                    value={draft.isbn}
                    onChange={(event) =>
                      setDraft((current) => ({ ...current, isbn: event.target.value }))
                    }
                    className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm text-foreground outline-none transition focus:border-primary"
                  />
                </label>
                <label className="space-y-1 text-xs font-medium text-muted-foreground">
                  <span>Original Language</span>
                  <input
                    value={draft.originalLanguage}
                    onChange={(event) =>
                      setDraft((current) => ({ ...current, originalLanguage: event.target.value }))
                    }
                    className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm text-foreground outline-none transition focus:border-primary"
                  />
                </label>
                <label className="space-y-1 text-xs font-medium text-muted-foreground">
                  <span>Cover URL</span>
                  <input
                    value={draft.coverURI}
                    onChange={(event) =>
                      setDraft((current) => ({ ...current, coverURI: event.target.value }))
                    }
                    className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm text-foreground outline-none transition focus:border-primary"
                  />
                </label>
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <button
                  onClick={saveChanges}
                  disabled={saving}
                  className="rounded-xl bg-primary px-5 py-2.5 text-xs sm:text-sm font-semibold text-primary-foreground transition hover:bg-primary/90 disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>
                {status && (
                  <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
                    {status}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </ReadProvider>
  );
}

export default BookDescription;
