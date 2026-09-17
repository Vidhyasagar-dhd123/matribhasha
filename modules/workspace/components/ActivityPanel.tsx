"use client";

import Link from "next/link";
import { BookMarked, Clock, Compass, Plus, Layers3, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "@/modules/auth/contexts/authContext";
import { getRequestHeaders } from "@/modules/shared/utils/request";

interface UserDashboardData {
  stats?: {
    translatedPages: number;
    translatedBooks: number;
  };
  translatedBooks?: {
    uuid: string;
    title: string;
    author: string;
    originalLanguage: string;
  }[];
  recentBookmarks?: {
    bookUUID: string;
    pageNumber: number;
    language: string;
    book?: {
      title: string;
      author: string;
    };
  }[];
}

export const ActivityPanel = () => {
  const { user } = useAuth();
  const [data, setData] = useState<UserDashboardData | null>(null);

  useEffect(() => {
    if (!user) return;
    const fetchDashboard = async () => {
      try {
        const res = await fetch("/api/v1/users/dashboard", {
          headers: getRequestHeaders(),
        });
        if (res.ok) {
          const json = await res.json();
          setData(json);
        }
      } catch (err) {
        console.error("Error loading workspace activity:", err);
      }
    };
    fetchDashboard();
  }, [user]);

  const recentTranslations = data?.translatedBooks || [];
  const bookmarks = data?.recentBookmarks || [];

  return (
    <div className="w-full rounded-2xl border border-border bg-card p-6 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
            Workspace Hub
          </p>
          <h2 className="mt-2 text-xl font-semibold text-foreground">
            Your Active Projects & Bookmarks
          </h2>
        </div>
        <Link
          href="/vivar"
          className="inline-flex items-center gap-2 rounded-xl border border-border px-4 py-2 text-sm font-medium text-foreground transition hover:bg-muted"
        >
          <Compass className="h-4 w-4" /> Explore Vivar
        </Link>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {/* Active Translations */}
        <div className="rounded-xl bg-muted/50 p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <Clock className="h-4 w-4 text-primary" /> Active Translations
            </div>
            <div className="mt-3 space-y-2">
              {recentTranslations.length === 0 ? (
                <p className="text-xs text-muted-foreground py-2">
                  No active translations yet. Start translating a book!
                </p>
              ) : (
                recentTranslations.slice(0, 3).map((book) => (
                  <Link
                    key={book.uuid}
                    href={`/workspace/${book.uuid}`}
                    className="flex items-center justify-between rounded-lg border border-border bg-card px-3 py-2.5 text-sm text-foreground hover:border-primary transition group"
                  >
                    <div>
                      <div className="font-medium text-sm group-hover:text-primary transition">
                        {book.title}
                      </div>
                      <div className="text-xs text-muted-foreground">{book.originalLanguage}</div>
                    </div>
                    <ArrowRight size={14} className="text-muted-foreground group-hover:text-primary transition" />
                  </Link>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Reading Bookmarks */}
        <div className="rounded-xl bg-muted/50 p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <BookMarked className="h-4 w-4 text-emerald-500" /> Jump Back In
            </div>
            <div className="mt-3 space-y-2">
              {bookmarks.length === 0 ? (
                <p className="text-xs text-muted-foreground py-2">
                  Open any book to save automatic page bookmarks.
                </p>
              ) : (
                bookmarks.slice(0, 3).map((item) => (
                  <Link
                    key={item.bookUUID}
                    href={`/read/${item.bookUUID}?page=${item.pageNumber}`}
                    className="flex items-center justify-between rounded-lg border border-border bg-card px-3 py-2.5 hover:border-emerald-500 transition group"
                  >
                    <div>
                      <div className="text-sm font-semibold text-foreground group-hover:text-emerald-500 transition">
                        {item.book?.title || item.bookUUID}
                      </div>
                      <div className="mt-0.5 text-xs text-muted-foreground">
                        Page {item.pageNumber} · {item.language}
                      </div>
                    </div>
                    <ArrowRight size={14} className="text-muted-foreground group-hover:text-emerald-500 transition" />
                  </Link>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row">
        <Link
          href="/books"
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" /> Browse Catalog to Translate
        </Link>
        <div className="flex items-center gap-2 rounded-xl border border-dashed border-border px-4 py-3 text-xs text-muted-foreground">
          <Layers3 className="h-4 w-4 shrink-0 text-muted-foreground" />
          Translators can compare source text and draft translations side-by-side with AI assistance.
        </div>
      </div>
    </div>
  );
};