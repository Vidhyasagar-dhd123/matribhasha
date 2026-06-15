import { useMemo } from "react"
import { useReader } from "../contexts/read.context"

const ActivityTab = () =>
{
    const { authors, page, book } = useReader()

    const activity = useMemo(() => {
        return [
            `Current page: ${page?.data?.pageNumber || 1}`,
            `Book UUID: ${book?.data?.uuid || "unknown"}`,
            `Versions loaded: ${(authors?.data || []).length}`,
        ]
    }, [authors?.data, book?.data?.uuid, page?.data?.pageNumber])

    return (
        <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-600">Activity</p>
                <h3 className="mt-2 text-2xl font-semibold text-slate-950">Recent reader activity</h3>
                <div className="mt-5 space-y-3">
                    {activity.map((item) => (
                        <div key={item} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
                            {item}
                        </div>
                    ))}
                </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-950 p-6 text-white shadow-sm">
                <div className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-300">Tips</div>
                <p className="mt-3 text-sm leading-7 text-slate-300">
                    Switch languages and authors to compare different translations of the same page.
                </p>
            </div>
        </div>
    )
}

export default ActivityTab;