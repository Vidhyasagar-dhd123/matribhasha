import { useMemo } from "react"
import { useReader } from "../contexts/read.context"

const LanguageTab = () =>
{
    const { book, authors, language } = useReader()

    const languages = useMemo(() => {
        const fromAuthors = (authors?.data || []).map((item) => item.language).filter(Boolean)
        const fromBook = book?.data?.translatedLanguages || []
        return Array.from(new Set([...fromBook, ...fromAuthors, book?.data?.originalLanguage || ""]))
            .filter(Boolean)
    }, [authors?.data, book?.data])

    return (
        <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-600">Languages & Versions</p>
                <h3 className="mt-2 text-2xl font-semibold text-slate-950">Available language versions</h3>
                <div className="mt-5 flex flex-wrap gap-2">
                    {languages.map((item) => (
                        <span key={item} className={`rounded-full px-3 py-1 text-sm font-medium ${language?.data === item ? "bg-slate-950 text-white" : "bg-emerald-50 text-emerald-700"}`}>
                            {item}
                        </span>
                    ))}
                </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
                <div className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-600">Translation notes</div>
                <p className="mt-3 text-sm leading-7 text-slate-600">
                    The reader will automatically load the best matching page version for the current language and author selection.
                </p>
            </div>
        </div>
    )
}

export default LanguageTab;