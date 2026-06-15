import { useReader } from "../contexts/read.context"

const ReviewTab = () =>
{
    const { book } = useReader()

    return (
        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-600">Reviews</p>
                <h3 className="mt-2 text-2xl font-semibold text-slate-950">Reader feedback and quality signals</h3>
                <div className="mt-5 rounded-2xl bg-slate-50 p-5 text-sm leading-7 text-slate-700">
                    {book?.data?.reviews || "No review score is available yet."}
                </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-950 p-6 text-white shadow-sm">
                <div className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-300">Contribute</div>
                <p className="mt-3 text-sm leading-7 text-slate-300">
                    Add translation notes and review quality from the workspace once you finish editing a page version.
                </p>
            </div>
        </div>
    )
}

export default ReviewTab;