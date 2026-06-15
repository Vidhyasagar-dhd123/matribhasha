import Link from "next/link"
import { BookMarked, Clock, Compass, Layers3 } from "lucide-react"


export const ActivityPanel = () =>{
    const recentActivities = [
        "Translated a page into Hindi",
        "Reviewed a multilingual story draft",
        "Saved a new reading workspace",
    ]

    const savedBooks = [
        { title: "A train through the monsoon", note: "Hindi + English" },
        { title: "River songs at dusk", note: "Bengali + Odia" },
        { title: "Market day memories", note: "Tamil + Malayalam" },
    ]

    return <div className="w-full rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between gap-3">
            <div>
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-600">Workspace</p>
                <h2 className="mt-2 text-2xl font-semibold text-slate-950">Quick actions and recent activity</h2>
            </div>
            <Link href="/Vivar" className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50">
                <Compass className="h-4 w-4" /> Explore Vivar
            </Link>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="rounded-3xl bg-slate-50 p-5">
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-950">
                    <Clock className="h-4 w-4 text-emerald-600" /> Your Activity
                </div>
                <div className="mt-4 space-y-3">
                    {recentActivities.map((activity) => (
                        <div key={activity} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700">
                            {activity}
                        </div>
                    ))}
                </div>
            </div>

            <div className="rounded-3xl bg-slate-50 p-5">
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-950">
                    <BookMarked className="h-4 w-4 text-emerald-600" /> Saved Books
                </div>
                <div className="mt-4 space-y-3">
                    {savedBooks.map((book) => (
                        <div key={book.title} className="rounded-2xl border border-slate-200 bg-white px-4 py-3">
                            <div className="text-sm font-semibold text-slate-950">{book.title}</div>
                            <div className="mt-1 text-xs text-slate-500">{book.note}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>

        <div className="mt-6 rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-5">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-950">
                <Layers3 className="h-4 w-4 text-emerald-600" /> Suggested next step
            </div>
            <p className="mt-2 text-sm leading-7 text-slate-600">
                Open a book, move it into a workspace, and compare source text with translations side by side.
            </p>
        </div>
    </div>
}