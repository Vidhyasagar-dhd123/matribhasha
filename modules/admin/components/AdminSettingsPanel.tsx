"use client"

import { useAuth } from "@/modules/auth/contexts/authContext"
import { PageHeader } from "./PageHeader"

const settings = [
  { label: "Upload service", value: "Cloudinary-backed admin upload" },
  { label: "Book ingestion", value: "Create, edit, delete, and page authoring enabled" },
  { label: "Search", value: "Server-side catalog and user search enabled" },
  { label: "Analytics", value: "Backend aggregated dashboard metrics" },
]

export default function AdminSettingsPanel() {
  const { user } = useAuth()

  return (
    <div className="space-y-6">
      <PageHeader section="Admin" title="Settings" />

      <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
        <div className="border-b border-border pb-4">
          <p className="text-sm font-medium text-muted-foreground">Settings</p>
          <h2 className="mt-1 text-xl font-semibold text-foreground">Platform controls</h2>
          <p className="mt-1 text-sm text-muted-foreground">Operational capabilities available in the admin workspace.</p>
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {settings.map((setting) => (
            <div key={setting.label} className="rounded-lg border border-border bg-background p-4">
              <div className="text-sm font-semibold text-foreground">{setting.label}</div>
              <div className="mt-1 text-sm text-muted-foreground">{setting.value}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-lg border border-border bg-muted p-4 shadow-sm">
        <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Admin account</div>
        <div className="mt-2 text-lg font-semibold text-foreground">{user?.name || user?.email || "Admin"}</div>
        <div className="mt-1 text-sm text-muted-foreground">Core operations are available through the books, users, and PDF & AI sections.</div>
      </div>
    </div>
  )
}