import Link from "next/link"
import { useReader } from "../contexts/read.context"

const OverviewTab = () =>
{
    const { book, page, pages } = useReader()

    return (
        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-600">Overview</p>
                <h3 className="mt-2 text-2xl font-semibold text-slate-950">{book?.data?.title || "Untitled book"}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">
                    {book?.data?.description || "No description is available for this book yet."}
                </p>

                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    {[
                        ["Author", book?.data?.author || "Unknown"],
                        ["Language", book?.data?.originalLanguage || "Unknown"],
                        ["Current page", page?.data?.pageNumber?.toString() || "1"],
                        ["Pages loaded", pages?.data?.length?.toString() || "0"],
                    ].map(([label, value]) => (
                        <div key={label} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                            <div className="text-xs uppercase tracking-[0.2em] text-slate-500">{label}</div>
                            <div className="mt-2 text-sm font-semibold text-slate-950">{value}</div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-950 p-6 text-white shadow-sm">
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-300">Quick actions</p>
                <div className="mt-4 space-y-3 text-sm text-slate-300">
                    <p>Use the reader tab to start reading the current page.</p>
                    <p>Open the workspace to edit translations and save versions.</p>
                    <p>Switch between languages in the language tab to compare versions.</p>
                </div>
                <div className="mt-6 flex flex-wrap gap-3">
                    <Link href={`/Read/${book?.data?.uuid || ""}`} className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-slate-100">Open reader</Link>
                    <Link href={`/Workspace/${book?.data?.uuid || ""}`} className="rounded-full border border-white/20 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10">Open workspace</Link>
                </div>
            </div>
        </div>
    )
}

export default OverviewTab;