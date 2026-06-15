"use client"

import { useEffect, useMemo, useState } from "react"
import { BarChart, Bar, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { BookOpen, Languages, LayoutDashboard, Users } from "lucide-react"
import { useAuth } from "@/modules/auth/contexts/authContext"

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

export default function AdminDashboardPanel() {
  const { user } = useAuth()
  const [analytics, setAnalytics] = useState<Analytics | null>(null)

  useEffect(() => {
    const loadAnalytics = async () => {
      const response = await fetch("/api/v1/admin/analytics")
      if (response.ok) {
        setAnalytics(await response.json())
      }
    }

    loadAnalytics()
  }, [])

  const metrics = useMemo(() => [
    { label: "Books", value: analytics?.summary.totalBooks || 0, icon: BookOpen },
    { label: "Users", value: analytics?.summary.totalUsers || 0, icon: Users },
    { label: "Languages", value: analytics?.summary.totalLanguages || 0, icon: Languages },
    { label: "Pages", value: analytics?.summary.totalPages || 0, icon: LayoutDashboard },
  ], [analytics])

  const chartData = analytics?.monthlyBooks?.length ? analytics.monthlyBooks : [
    { month: "Jan", year: 2026, count: 0 },
    { month: "Feb", year: 2026, count: 0 },
    { month: "Mar", year: 2026, count: 0 },
    { month: "Apr", year: 2026, count: 0 },
  ]

  return (
    <div className="space-y-6">
      <div className="rounded-[2rem] border border-white/80 bg-white/90 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-sky-600">Admin dashboard</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">System overview</h1>
            <p className="mt-2 text-sm leading-7 text-slate-600">Global catalog analytics, user activity, and moderation status.</p>
          </div>
          <div className="rounded-[1.5rem] bg-slate-950 px-4 py-3 text-white">
            <p className="text-xs uppercase tracking-[0.25em] text-emerald-300">Signed in as</p>
            <p className="mt-1 text-sm font-semibold">{user?.name || user?.email || "Admin"}</p>
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {metrics.map((metric) => {
            const Icon = metric.icon
            return (
              <div key={metric.label} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <Icon className="h-5 w-5 text-slate-600" />
                <div className="mt-3 text-3xl font-semibold text-slate-950">{metric.value}</div>
                <div className="text-sm text-slate-600">{metric.label}</div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-950">Monthly content growth</h2>
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
          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-950">Books by language</h2>
            <div className="mt-4 space-y-3">
              {(analytics?.booksByLanguage || []).map((item) => (
                <div key={item.language} className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3 text-sm">
                  <span className="font-medium text-slate-900">{item.language}</span>
                  <span className="text-slate-600">{item.count}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-slate-950 p-6 text-white shadow-sm">
            <h2 className="text-lg font-semibold">Moderation snapshot</h2>
            <div className="mt-4 grid gap-3 text-sm text-slate-300">
              <div className="flex justify-between"><span>Blocked users</span><span>{analytics?.summary.blockedUsers || 0}</span></div>
              <div className="flex justify-between"><span>Roles tracked</span><span>{analytics?.usersByRole?.length || 0}</span></div>
              <div className="flex justify-between"><span>Total versions</span><span>{analytics?.summary.totalVersions || 0}</span></div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-950">Recent books</h2>
          <div className="mt-4 space-y-3">
            {(analytics?.recentBooks || []).map((book) => (
              <div key={book.uuid} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm">
                <div className="font-medium text-slate-950">{book.title}</div>
                <div className="text-slate-600">{book.author} · {book.originalLanguage}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-950">Top authors</h2>
          <div className="mt-4 space-y-3">
            {(analytics?.topAuthors || []).map((item) => (
              <div key={item.author} className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3 text-sm">
                <span className="font-medium text-slate-900">{item.author}</span>
                <span className="text-slate-600">{item.count} books</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}