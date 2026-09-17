"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  Users,
  Languages,
  FileText,
  Layers,
  TrendingUp,
  Sparkles,
  Loader2,
  ArrowRight,
  User,
  Heart,
  BookMarked,
  CheckCircle2,
} from "lucide-react";
import { useAuth } from "@/modules/auth/contexts/authContext";
import { getRequestHeaders } from "@/modules/shared/utils/request";

interface PlatformAnalytics {
  summary: {
    totalBooks: number;
    totalUsers: number;
    totalPages: number;
    totalVersions: number;
    multiVersionBooks: number;
    totalLanguages: number;
    blockedUsers: number;
    vivarPosts: number;
  };
  booksByLanguage: { language: string; count: number }[];
  recentBooks: {
    _id: string;
    title: string;
    author: string;
    originalLanguage: string;
    uuid: string;
    coverURI?: string;
    pages: number;
    versions: number;
    contributors: number;
    translatedLanguages: string[];
    genre?: string;
  }[];
  topAuthors: { author: string; count: number }[];
}

interface UserDashboardData {
  stats: {
    translatedPages: number;
    translatedBooks: number;
    languagesCount: number;
    vivarPosts: number;
    totalLikesReceived: number;
  };
  translatedLanguages: string[];
  recentTranslations: {
    _id: string;
    language: string;
    content: string;
    pageId?: {
      bookUUID?: string;
      pageNumber?: number;
      originalLanguage?: string;
    };
    updatedAt: string;
  }[];
  translatedBooks: {
    uuid: string;
    title: string;
    author: string;
    originalLanguage: string;
    genre?: string;
  }[];
  recentBookmarks: {
    bookUUID: string;
    pageNumber: number;
    language: string;
    role: string;
    book?: {
      title: string;
      author: string;
      coverURI?: string;
    };
  }[];
  recentVivars: {
    _id: string;
    selectedText: string;
    bookTitle: string;
    bookUUID: string;
    pageNumber: number;
    likes?: string[];
  }[];
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<"personal" | "platform">("personal");
  const [platformData, setPlatformData] = useState<PlatformAnalytics | null>(null);
  const [userData, setUserData] = useState<UserDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [languageFilter, setLanguageFilter] = useState<string>("All");

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      setError(null);
      try {
        if (user) {
          // Load personal dashboard
          const userRes = await fetch("/api/v1/users/dashboard", {
            headers: getRequestHeaders(true),
          });
          if (userRes.ok) {
            const userJson = await userRes.json();
            setUserData(userJson);
            setActiveTab("personal");
          }

          // If admin, load platform analytics
          if (user.role === "admin") {
            const platformRes = await fetch("/api/v1/dashboard", {
              headers: getRequestHeaders(true),
            });
            if (platformRes.ok) {
              const json = await platformRes.json();
              setPlatformData(json);
            }
          }
        }
      } catch {
        setError("Network error loading dashboard metrics.");
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [user]);

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-muted-foreground">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm">Loading Matribhāsha intelligence...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="mx-auto max-w-2xl py-16 px-4 text-center">
        <div className="rounded-3xl border border-border bg-card p-8 shadow-sm">
          <BookOpen className="mx-auto h-12 w-12 text-primary mb-4" />
          <h2 className="text-2xl font-bold text-foreground">Welcome to Matribhāsha Workspace</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Sign in to track your translation contributions, reading progress, and literary bookmarks.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Link
              href="/login"
              className="rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition"
            >
              Sign In
            </Link>
            <Link
              href="/books"
              className="rounded-xl border border-border bg-muted px-5 py-2.5 text-sm font-semibold text-foreground hover:bg-card transition"
            >
              Explore Books
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (error || (activeTab === "personal" && !userData)) {
    return (
      <div className="mx-auto max-w-4xl py-12 px-4 text-center">
        <div className="rounded-2xl border border-destructive/30 bg-destructive/10 p-8 text-destructive">
          <h2 className="text-lg font-bold">Unable to load workspace metrics</h2>
          <p className="mt-1 text-sm">{error || "Could not retrieve your dashboard activity."}</p>
        </div>
      </div>
    );
  }

  const summary = platformData?.summary;
  const booksByLanguage = platformData?.booksByLanguage || [];
  const recentBooks = platformData?.recentBooks || [];
  const topAuthors = platformData?.topAuthors || [];

  const filteredBooks =
    languageFilter === "All"
      ? recentBooks
      : recentBooks.filter(
          (b) =>
            b.originalLanguage === languageFilter ||
            b.translatedLanguages?.includes(languageFilter)
        );

  return (
    <div className="min-h-screen bg-background text-foreground py-8 px-4 sm:px-6">
      <div className="mx-auto max-w-6xl space-y-8">
        {/* Top Header & Tab Selector */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border pb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary mb-2">
              <TrendingUp size={14} />
              <span>Studio Analytics & Platform Intelligence</span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              {activeTab === "personal" && user
                ? `Welcome back, ${user.name || user.username}`
                : "Platform Dashboard"}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {activeTab === "personal"
                ? "Track your translation momentum, reading bookmarks, and community appreciation."
                : "Real-time insights across Indian languages, books, and translation projects."}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Personal / Platform Toggle */}
            <div className="flex items-center rounded-xl border border-border bg-card p-1">
              {user && (
                <button
                  onClick={() => setActiveTab("personal")}
                  className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                    activeTab === "personal"
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <User size={14} />
                  <span>My Workspace</span>
                </button>
              )}
              {user?.role === "admin" && (
                <button
                  onClick={() => setActiveTab("platform")}
                  className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                    activeTab === "platform"
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <TrendingUp size={14} />
                  <span>Platform Intel</span>
                </button>
              )}
            </div>

            <Link
              href="/workspace"
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-xs sm:text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 transition"
            >
              <BookOpen size={15} />
              <span>Open Studio</span>
            </Link>
          </div>
        </div>

        {/* PERSONAL TRANSLATOR DASHBOARD VIEW */}
        {activeTab === "personal" && userData ? (
          <div className="space-y-8">
            {/* Personal Stat Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Translated Pages</span>
                  <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 size={16} />
                  </div>
                </div>
                <div className="mt-3 text-3xl font-bold text-foreground">
                  {userData.stats.translatedPages}
                </div>
                <div className="mt-1 text-xs text-muted-foreground">
                  across {userData.stats.translatedBooks} books
                </div>
              </div>

              <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Languages Mastered</span>
                  <div className="p-1.5 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400">
                    <Languages size={16} />
                  </div>
                </div>
                <div className="mt-3 text-3xl font-bold text-foreground">
                  {userData.stats.languagesCount}
                </div>
                <div className="mt-1 text-xs text-muted-foreground">
                  {userData.translatedLanguages.join(", ") || "Active contributor"}
                </div>
              </div>

              <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Vivar Excerpts</span>
                  <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
                    <Sparkles size={16} />
                  </div>
                </div>
                <div className="mt-3 text-3xl font-bold text-foreground">
                  {userData.stats.vivarPosts}
                </div>
                <div className="mt-1 text-xs text-muted-foreground">Quotes shared</div>
              </div>

              <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Appreciation</span>
                  <div className="p-1.5 rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400">
                    <Heart size={16} />
                  </div>
                </div>
                <div className="mt-3 text-3xl font-bold text-foreground">
                  {userData.stats.totalLikesReceived}
                </div>
                <div className="mt-1 text-xs text-muted-foreground">Community likes</div>
              </div>
            </div>

            {/* Reading Bookmarks & Active Translations */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Jump Back In (Bookmarks) */}
              <div className="rounded-3xl border border-border bg-card p-6 shadow-sm flex flex-col justify-between">
                <div>
                  <h2 className="text-base font-bold text-foreground flex items-center gap-2 mb-4">
                    <BookMarked size={18} className="text-primary" />
                    Reading & Studio Bookmarks
                  </h2>
                  <div className="space-y-3">
                    {userData.recentBookmarks.length === 0 ? (
                      <p className="text-xs text-muted-foreground py-4">
                        No bookmarks recorded. Read or translate a book to save your spot!
                      </p>
                    ) : (
                      userData.recentBookmarks.slice(0, 4).map((item) => (
                        <Link
                          key={item.bookUUID}
                          href={
                            item.role === "translator"
                              ? `/workspace/${item.bookUUID}`
                              : `/read/${item.bookUUID}?page=${item.pageNumber}`
                          }
                          className="flex items-center justify-between rounded-xl border border-border bg-muted/30 p-3.5 hover:border-primary/50 transition group"
                        >
                          <div>
                            <div className="font-semibold text-sm text-foreground group-hover:text-primary transition">
                              {item.book?.title || item.bookUUID}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              Page {item.pageNumber} · {item.language} ({item.role})
                            </div>
                          </div>
                          <span className="text-xs font-semibold text-primary group-hover:translate-x-0.5 transition-transform">
                            Resume &rarr;
                          </span>
                        </Link>
                      ))
                    )}
                  </div>
                </div>
                <Link
                  href="/books"
                  className="mt-4 text-xs font-semibold text-primary hover:underline"
                >
                  Browse more books &rarr;
                </Link>
              </div>

              {/* Contributed Books */}
              <div className="rounded-3xl border border-border bg-card p-6 shadow-sm flex flex-col justify-between">
                <div>
                  <h2 className="text-base font-bold text-foreground flex items-center gap-2 mb-4">
                    <Layers size={18} className="text-emerald-500" />
                    Your Contributed Books
                  </h2>
                  <div className="space-y-3">
                    {userData.translatedBooks.length === 0 ? (
                      <p className="text-xs text-muted-foreground py-4">
                        You haven&apos;t contributed translations yet. Pick any book in the workspace to start translating!
                      </p>
                    ) : (
                      userData.translatedBooks.slice(0, 4).map((book) => (
                        <Link
                          key={book.uuid}
                          href={`/workspace/${book.uuid}`}
                          className="flex items-center justify-between rounded-xl border border-border bg-muted/30 p-3.5 hover:border-emerald-500/50 transition group"
                        >
                          <div>
                            <div className="font-semibold text-sm text-foreground group-hover:text-emerald-500 transition">
                              {book.title}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              by {book.author} · {book.originalLanguage}
                            </div>
                          </div>
                          <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                            Translate &rarr;
                          </span>
                        </Link>
                      ))
                    )}
                  </div>
                </div>
                <Link
                  href="/workspace"
                  className="mt-4 text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
                >
                  Go to Translation Studio &rarr;
                </Link>
              </div>
            </div>
          </div>
        ) : activeTab === "platform" && summary ? (
          /* PLATFORM INTELLIGENCE VIEW */
          <div className="space-y-8">
            {/* Global Stats Grid */}
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
              {[
                { label: "Total Books", value: summary.totalBooks, icon: BookOpen, color: "text-blue-500", bg: "bg-blue-500/10" },
                { label: "Contributors", value: summary.totalUsers, icon: Users, color: "text-emerald-500", bg: "bg-emerald-500/10" },
                { label: "Languages", value: summary.totalLanguages, icon: Languages, color: "text-purple-500", bg: "bg-purple-500/10" },
                { label: "Total Pages", value: summary.totalPages, icon: FileText, color: "text-amber-500", bg: "bg-amber-500/10" },
                { label: "Translations", value: summary.totalVersions, icon: Layers, color: "text-indigo-500", bg: "bg-indigo-500/10" },
                { label: "Vivar Reels", value: summary.vivarPosts, icon: Sparkles, color: "text-rose-500", bg: "bg-rose-500/10" },
              ].map((stat, i) => {
                const Icon = stat.icon;
                return (
                  <div
                    key={i}
                    className="flex flex-col justify-between rounded-2xl border border-border bg-card p-4 shadow-sm"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-muted-foreground">{stat.label}</span>
                      <div className={`flex h-7 w-7 items-center justify-center rounded-lg ${stat.bg} ${stat.color}`}>
                        <Icon size={14} />
                      </div>
                    </div>
                    <div className="mt-3 text-2xl font-bold tracking-tight text-foreground">
                      {stat.value}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Language Breakdown & Multi-version Intelligence */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              {/* Languages Breakdown */}
              <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                <h2 className="text-base font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Languages size={18} className="text-primary" />
                  Books by Language
                </h2>
                <div className="space-y-3">
                  {booksByLanguage.length === 0 ? (
                    <p className="text-xs text-muted-foreground">No languages indexed yet.</p>
                  ) : (
                    booksByLanguage.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between text-sm">
                        <span className="font-medium text-foreground">{item.language}</span>
                        <span className="rounded-md bg-secondary px-2 py-0.5 text-xs font-semibold text-secondary-foreground">
                          {item.count} {item.count === 1 ? "book" : "books"}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Featured Authors */}
              <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                <h2 className="text-base font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Users size={18} className="text-primary" />
                  Featured Authors
                </h2>
                <div className="space-y-3">
                  {topAuthors.length === 0 ? (
                    <p className="text-xs text-muted-foreground">No authors indexed yet.</p>
                  ) : (
                    topAuthors.map((author, idx) => (
                      <div key={idx} className="flex items-center justify-between text-sm">
                        <span className="font-medium text-foreground">{author.author}</span>
                        <span className="text-xs text-muted-foreground">{author.count} books</span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Collaborative Multi-version ratio */}
              <div className="rounded-2xl border border-border bg-card p-6 shadow-sm flex flex-col justify-between">
                <div>
                  <h2 className="text-base font-semibold text-foreground mb-2 flex items-center gap-2">
                    <Layers size={18} className="text-primary" />
                    Multilingual Depth
                  </h2>
                  <p className="text-xs text-muted-foreground mb-4">
                    Books with community translations across multiple Indian languages.
                  </p>
                  <div className="rounded-xl bg-muted/40 p-4 text-center">
                    <div className="text-3xl font-bold text-foreground">{summary.multiVersionBooks}</div>
                    <div className="text-xs text-muted-foreground mt-1">Multi-version Books</div>
                  </div>
                </div>
                <Link
                  href="/books"
                  className="mt-4 inline-flex items-center justify-center gap-1.5 text-xs font-semibold text-primary hover:underline"
                >
                  <span>Explore Catalog</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>

            {/* Catalog Activity with Language Filter */}
            <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
                <h2 className="text-base font-semibold text-foreground flex items-center gap-2">
                  <BookOpen size={18} className="text-primary" />
                  Active Catalog Books
                </h2>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">Filter Language:</span>
                  <select
                    value={languageFilter}
                    onChange={(e) => setLanguageFilter(e.target.value)}
                    className="rounded-lg border border-border bg-background px-3 py-1.5 text-xs text-foreground outline-none"
                  >
                    <option value="All">All Languages</option>
                    {booksByLanguage.map((l) => (
                      <option key={l.language} value={l.language}>
                        {l.language}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="divide-y divide-border">
                {filteredBooks.map((book) => (
                  <div key={book.uuid} className="py-3.5 flex items-center justify-between gap-4">
                    <div>
                      <Link
                        href={`/books/${book.uuid}`}
                        className="font-semibold text-foreground hover:underline text-sm"
                      >
                        {book.title}
                      </Link>
                      <div className="text-xs text-muted-foreground">
                        by {book.author} · {book.originalLanguage}{" "}
                        {book.genre ? `· ${book.genre}` : ""}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-muted-foreground hidden sm:inline">
                        {book.versions} {book.versions === 1 ? "version" : "versions"}
                      </span>
                      <Link
                        href={`/workspace/${book.uuid}`}
                        className="rounded-lg bg-secondary px-3 py-1.5 text-xs font-medium text-secondary-foreground hover:bg-muted transition"
                      >
                        Translate
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
