"use client"

import { useEffect, useMemo, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { BookOpen, Languages, LibraryBig, PencilLine, Sparkles, Users } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/modules/auth/contexts/authContext"
import { Book } from "@/modules/books/utils/books"

type Analytics = {
  summary: {
    totalBooks: number
    totalUsers: number
    totalPages: number
    totalVersions: number
    multiVersionBooks: number
    totalLanguages: number
    blockedUsers: number
  }
  booksByLanguage: { language: string; count: number }[]
  recentBooks: Array<Pick<Book, "_id" | "title" | "author" | "originalLanguage" | "uuid" | "coverURI" | "pages" | "versions" | "genre">>
  topAuthors: { author: string; count: number }[]
  monthlyBooks: { month: string; year: number; count: number }[]
  usersByRole: { role: string; count: number }[]
}

export default function DashboardPage() {
  const { user } = useAuth()
  const [analytics, setAnalytics] = useState<Analytics | null>(null)

  useEffect(() => {
    const loadAnalytics = async () => {
      const response = await fetch("/api/v1/dashboard")
      if (response.ok) {
        const data = await response.json()
        setAnalytics(data)
      }
    }

    loadAnalytics()
  }, [])

  const dashboard = useMemo(() => {
    return {
      totalBooks: analytics?.summary.totalBooks || 0,
      languages: analytics?.summary.totalLanguages || 0,
      pages: analytics?.summary.totalPages || 0,
      translated: analytics?.summary.totalVersions || 0,
    }
  }, [analytics])

  const quickStats = [
    {
      label: "Books in catalog",
      value: dashboard.totalBooks,
      icon: LibraryBig,
      accent: "text-sky-600",
    },
    {
      label: "Languages represented",
      value: dashboard.languages,
      icon: Languages,
      accent: "text-emerald-600",
    },
    {
      label: "Pages indexed",
      value: dashboard.pages,
      icon: BookOpen,
      accent: "text-amber-600",
    },
    {
      label: "Multi-version books",
      value: analytics?.summary.multiVersionBooks || 0,
      icon: Sparkles,
      accent: "text-pink-600",
    },
  ]

  const recentBooks = analytics?.recentBooks || []
  const chartData = analytics?.monthlyBooks?.length ? analytics.monthlyBooks : [
    { month: "Jan", year: 2026, count: 5 },
    { month: "Feb", year: 2026, count: 8 },
    { month: "Mar", year: 2026, count: 3 },
    { month: "Apr", year: 2026, count: 10 },
    { month: "May", year: 2026, count: 6 },
    { month: "Jun", year: 2026, count: 9 },
  ]

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.14),transparent_34%),linear-gradient(180deg,#f8fafc_0%,#eef2ff_100%)] px-4 py-8 sm:px-6 lg:px-8">
      <section className="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <Card className="overflow-hidden border-white/70 bg-white/85 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur">
            <CardHeader className="space-y-4">
              <div className="flex flex-wrap items-center gap-3 text-sm">
                <span className="rounded-full bg-sky-50 px-3 py-1 font-semibold text-sky-700">Dummy dashboard</span>
                <span className="rounded-full bg-emerald-50 px-3 py-1 font-semibold text-emerald-700">Live catalog snapshot</span>
              </div>
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <CardTitle className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
                    Welcome{user?.name ? `, ${user.name}` : ""}
                  </CardTitle>
                  <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">
                    This dashboard now shows real catalog activity, lightweight reading signals, and shortcuts into the editor and reader.
                  </p>
                </div>
                <div className="flex items-center gap-4 rounded-[1.5rem] border border-slate-200 bg-slate-50 px-4 py-4">
                  <Image src="/profile.jpeg" alt="Profile" width={72} height={72} className="rounded-full object-cover ring-4 ring-white" />
                  <div>
                    <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Current user</p>
                    <p className="mt-1 text-lg font-semibold text-slate-950">{user?.username || user?.name || "Reader"}</p>
                    <p className="text-sm text-slate-600">{user?.email || "No account connected"}</p>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {quickStats.map((item) => {
                  const Icon = item.icon

                  return (
                    <div key={item.label} className="rounded-[1.5rem] border border-slate-200 bg-white p-4 shadow-sm">
                      <Icon className={`h-5 w-5 ${item.accent}`} />
                      <div className="mt-3 text-3xl font-semibold text-slate-950">{item.value}</div>
                      <div className="mt-1 text-sm text-slate-600">{item.label}</div>
                    </div>
                  )
                })}
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <Link href="/Books" className="rounded-[1.5rem] border border-slate-200 bg-slate-950 p-5 text-white transition hover:bg-slate-800">
                  <PencilLine className="h-5 w-5 text-emerald-300" />
                  <h3 className="mt-4 text-lg font-semibold">Open books</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-300">Browse the catalog, search, and jump into a reader or workspace.</p>
                </Link>
                <Link href="/Workspace" className="rounded-[1.5rem] border border-slate-200 bg-white p-5 transition hover:border-slate-300 hover:bg-slate-50">
                  <Users className="h-5 w-5 text-sky-600" />
                  <h3 className="mt-4 text-lg font-semibold text-slate-950">Go to workspace</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">Use the search and activity panels to continue reading tasks.</p>
                </Link>
                <Link href="/Vivar" className="rounded-[1.5rem] border border-slate-200 bg-white p-5 transition hover:border-slate-300 hover:bg-slate-50">
                  <Sparkles className="h-5 w-5 text-emerald-600" />
                  <h3 className="mt-4 text-lg font-semibold text-slate-950">Open Vivar</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">Explore scroll-based stories with a cleaner reading flow.</p>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200 bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl text-slate-950">Reading activity</CardTitle>
            </CardHeader>
            <CardContent className="h-[420px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#0f172a" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <Card className="border-slate-200 bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl text-slate-950">Recent books</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentBooks.length ? recentBooks.map((book) => (
                <Link key={book.uuid} href={`/Books/${book.uuid}`} className="block rounded-2xl border border-slate-200 bg-slate-50 p-4 transition hover:border-slate-300 hover:bg-white">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="text-sm font-semibold text-slate-950">{book.title}</div>
                      <div className="mt-1 text-sm text-slate-600">{book.author}</div>
                    </div>
                    <div className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-600 shadow-sm">
                      {book.originalLanguage}
                    </div>
                  </div>
                </Link>
              )) : (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-5 text-sm text-slate-500">
                  No books have been loaded yet.
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-slate-200 bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl text-slate-950">What this dashboard does</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              {[
                ["Catalog snapshot", "Shows how many books, pages, and languages are available."],
                ["Shortcuts", "Jump straight into books, workspace, or Vivar."],
                ["Identity", "Displays the current logged-in user when available."],
                ["Dummy analytics", "Uses live data where possible, but keeps the UX lightweight."],
              ].map(([title, detail]) => (
                <div key={title} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="text-sm font-semibold text-slate-950">{title}</div>
                  <div className="mt-1 text-sm leading-6 text-slate-600">{detail}</div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  )
}
