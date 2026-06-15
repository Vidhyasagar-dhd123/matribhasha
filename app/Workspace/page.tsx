import { ActivityPanel } from "@/modules/workspace/componnents/ActivityPanel";
import { SearchBar } from "@/modules/workspace/componnents/SearchBar";

const WorkspacePage = () => {
  return <div className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(34,197,94,0.12),transparent_34%),linear-gradient(180deg,#f8fafc_0%,#ecfdf5_100%)] px-4 py-8 sm:px-6 lg:px-8">
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
      <div className="max-w-3xl space-y-3">
        <p className="text-sm font-semibold uppercase tracking-[0.28em] text-emerald-700">Workspace</p>
        <h1 className="text-4xl font-semibold tracking-tight text-slate-950">Search, curate, and continue translating</h1>
        <p className="text-base leading-8 text-slate-600">
          This workspace now behaves like a lightweight dashboard: search books, open recent items, and jump into Vivar or the reader without leaving the page.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <SearchBar/>
        <ActivityPanel/>
      </div>
    </div>
  </div>;
}

export default WorkspacePage