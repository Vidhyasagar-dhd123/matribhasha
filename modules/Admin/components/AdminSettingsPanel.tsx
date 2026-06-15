"use client"

import { useAuth } from "@/modules/auth/contexts/authContext"

const settings = [
  { label: "Upload service", value: "Cloudinary-backed admin upload" },
  { label: "Book ingestion", value: "Create, edit, delete, and page authoring enabled" },
  { label: "Search", value: "Server-side catalog and user search enabled" },
  { label: "Analytics", value: "Backend aggregated dashboard metrics" },
]

export default function AdminSettingsPanel() {
  const { user } = useAuth()

  return (
    <div className="space-y-6 rounded-[2rem] border border-white/80 bg-white/90 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.28em] text-emerald-600">Settings</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">Platform controls</h1>
        <p className="mt-2 text-sm leading-7 text-slate-600">Operational toggles and implementation notes for the current admin workspace.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {settings.map((setting) => (
          <div key={setting.label} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <div className="text-sm font-semibold text-slate-950">{setting.label}</div>
            <div className="mt-1 text-sm text-slate-600">{setting.value}</div>
          </div>
        ))}
      </div>

      <div className="rounded-[1.5rem] border border-slate-200 bg-slate-950 p-5 text-white">
        <div className="text-xs uppercase tracking-[0.24em] text-emerald-300">Admin account</div>
        <div className="mt-2 text-lg font-semibold">{user?.name || user?.email || "Admin"}</div>
        <div className="mt-1 text-sm text-slate-300">This panel now exposes the core operations used by the backend and catalog UI.</div>
      </div>
    </div>
  )
}