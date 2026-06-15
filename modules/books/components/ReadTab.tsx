import Link from "next/link"
import { useReader } from "../contexts/read.context"

const ReadTab = () =>
{
    const { content, page, book } = useReader()

    return (
        <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between gap-4">
                    <div>
                        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-600">Read</p>
                        <h3 className="mt-2 text-2xl font-semibold text-slate-950">Page {page?.data?.pageNumber || 1}</h3>
                    </div>
                    <Link href={`/Read/${book?.data?.uuid || ""}`} className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">Open full reader</Link>
                </div>
                <div className="mt-6 rounded-2xl bg-slate-50 p-5 text-sm leading-8 text-slate-700">
                    {content?.data?.content || "Select a page from the reader to load content here."}
                </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-600">Reader notes</div>
                <ul className="mt-4 space-y-3 text-sm leading-7 text-slate-600">
                    <li>Content updates as you change the page or author language.</li>
                    <li>Use the workspace tab to edit the active version.</li>
                    <li>Pagination at the bottom of the reader moves through available pages.</li>
                </ul>
            </div>
        </div>
    )
}

export default ReadTab;