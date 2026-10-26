"use client"

import { useEffect, useMemo, useState } from "react"
import { BarChart, Bar, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { BookOpen, Languages, LayoutDashboard, Users } from "lucide-react"
import { useAuth } from "@/modules/auth/contexts/authContext"
import { getRequestHeaders } from "@/modules/shared/utils/request"
import { PageHeader } from "./PageHeader"

type Analytics = {
  summary: {
    totalBooks: number
    totalUsers: number
    totalPages: number
    totalVersions: number
    totalLanguages: number
    blockedUsers: number
  }
  booksByLanguage: { language: string; count: number }[]
  recentBooks: { title: string; author: string; originalLanguage: string; uuid: string; genre?: string }[]
  topAuthors: { author: string; count: number }[]
  monthlyBooks: { month: string; year: number; count: number }[]
  usersByRole: { role: string; count: number }[]
}

const EMPTY_ANALYTICS: Analytics = {
  summary: {
    totalBooks: 0,
    totalUsers: 0,
    totalPages: 0,
    totalVersions: 0,
    totalLanguages: 0,
    blockedUsers: 0,
  },
  booksByLanguage: [],
  recentBooks: [],
  topAuthors: [],
  monthlyBooks: [],
  usersByRole: [],
}

function EmptyState({ message }: { message: string }) {
  return <p className="py-4 text-sm text-slate-500">{message}</p>
}

export default function AdminDashboardPanel() {
  const { user } = useAuth()
  const [analytics, setAnalytics] = useState<Analytics | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadAnalytics = async () => {
      setLoading(true)
      setError(null)
      try {
        const response = await fetch("/api/v1/admin/reports", {
          headers: getRequestHeaders(false),
        })
        if (!response.ok) {
          throw new Error("Unable to load admin analytics.")
        }

        const data = await response.json()
        setAnalytics({
          ...EMPTY_ANALYTICS,
          ...data,
          summary: { ...EMPTY_ANALYTICS.summary, ...(data?.summary || {}) },
          booksByLanguage: Array.isArray(data?.booksByLanguage) ? data.booksByLanguage : [],
          recentBooks: Array.isArray(data?.recentBooks) ? data.recentBooks : [],
          topAuthors: Array.isArray(data?.topAuthors) ? data.topAuthors : [],
          monthlyBooks: Array.isArray(data?.monthlyBooks) ? data.monthlyBooks : [],
          usersByRole: Array.isArray(data?.usersByRole) ? data.usersByRole : [],
        })
      } catch (loadError) {
        console.error("Admin dashboard analytics error:", loadError)
        setAnalytics(EMPTY_ANALYTICS)
        setError(loadError instanceof Error ? loadError.message : "Unable to load admin analytics.")
      } finally {
        setLoading(false)
      }
    }

    loadAnalytics()
  }, [])

  const safeAnalytics = analytics || EMPTY_ANALYTICS
  const metrics = useMemo(() => [
    { label: "Books", value: safeAnalytics.summary.totalBooks, icon: BookOpen },
    { label: "Users", value: safeAnalytics.summary.totalUsers, icon: Users },
    { label: "Languages", value: safeAnalytics.summary.totalLanguages, icon: Languages },
    { label: "Pages", value: safeAnalytics.summary.totalPages, icon: LayoutDashboard },
  ], [safeAnalytics])

  const chartData = safeAnalytics.monthlyBooks.length ? safeAnalytics.monthlyBooks : [
    { month: "Jan", year: 2026, count: 0 },
    { month: "Feb", year: 2026, count: 0 },
    { month: "Mar", year: 2026, count: 0 },
    { month: "Apr", year: 2026, count: 0 },
  ]

  return (
    <div className="space-y-6">
      <PageHeader section="Admin" title="Dashboard" heading="System overview" />

      <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
        <div className="flex flex-col gap-3 border-b border-border pb-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Admin dashboard</p>
            <h2 className="mt-1 text-xl font-semibold text-foreground">System overview</h2>
            <p className="mt-1 text-sm text-muted-foreground">Global catalog analytics, user activity, and moderation status.</p>
          </div>
          <div className="rounded-lg border border-border bg-muted/50 px-4 py-3">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">Signed in as</p>
            <p className="mt-1 text-sm font-semibold text-foreground">{user?.name || user?.email || "Admin"}</p>
          </div>
        </div>

        {loading && <p className="mt-4 text-sm text-muted-foreground">Loading analytics...</p>}
        {error && !loading && (
          <p className="mt-4 rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-700 dark:text-amber-300">{error}</p>
        )}

        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {metrics.map((metric) => {
            const Icon = metric.icon
            return (
              <div key={metric.label} className="rounded-lg border border-border bg-background p-4">
                <Icon className="h-5 w-5 text-muted-foreground" />
                <div className="mt-3 text-3xl font-semibold text-foreground">{metric.value}</div>
                <div className="text-sm text-muted-foreground">{metric.label}</div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
          <h2 className="text-lg font-semibold text-foreground">Monthly content growth</h2>
          <div className="mt-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#0f172a" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
            <h2 className="text-lg font-semibold text-foreground">Books by language</h2>
            <div className="mt-4 space-y-3">
              {safeAnalytics.booksByLanguage.length === 0 ? (
                <EmptyState message="No language data available yet." />
              ) : (
                safeAnalytics.booksByLanguage.map((item) => (
                  <div key={item.language} className="flex items-center justify-between rounded-lg border border-border bg-background px-4 py-3 text-sm">
                    <span className="font-medium text-foreground">{item.language}</span>
                    <span className="text-muted-foreground">{item.count}</span>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="rounded-lg border border-border bg-muted p-4 shadow-sm">
            <h2 className="text-lg font-semibold text-foreground">Moderation snapshot</h2>
            <div className="mt-4 grid gap-3 text-sm text-muted-foreground">
              <div className="flex justify-between"><span>Blocked users</span><span>{safeAnalytics.summary.blockedUsers}</span></div>
              <div className="flex justify-between"><span>Roles tracked</span><span>{safeAnalytics.usersByRole.length}</span></div>
              <div className="flex justify-between"><span>Total versions</span><span>{safeAnalytics.summary.totalVersions}</span></div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
          <h2 className="text-lg font-semibold text-foreground">Recent books</h2>
          <div className="mt-4 space-y-3">
            {safeAnalytics.recentBooks.length === 0 ? (
              <EmptyState message="No books available yet." />
            ) : (
              safeAnalytics.recentBooks.map((book) => (
                <div key={book.uuid} className="rounded-lg border border-border bg-background px-4 py-3 text-sm">
                  <div className="font-medium text-foreground">{book.title}</div>
                  <div className="text-muted-foreground">{book.author} · {book.originalLanguage}</div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
          <h2 className="text-lg font-semibold text-foreground">Top authors</h2>
          <div className="mt-4 space-y-3">
            {safeAnalytics.topAuthors.length === 0 ? (
              <EmptyState message="No author data available yet." />
            ) : (
              safeAnalytics.topAuthors.map((item) => (
                <div key={item.author} className="flex items-center justify-between rounded-lg border border-border bg-background px-4 py-3 text-sm">
                  <span className="font-medium text-foreground">{item.author}</span>
                  <span className="text-muted-foreground">{item.count} books</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}