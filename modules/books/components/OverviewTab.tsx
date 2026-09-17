import Link from "next/link";
import { useReader } from "../contexts/read.context";

const OverviewTab = () => {
  const { book, page, pages } = useReader();

  return (
    <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">Overview</p>
        <h3 className="mt-2 text-2xl font-bold text-foreground">{book?.data?.title || "Untitled book"}</h3>
        <p className="mt-3 text-sm leading-7 text-muted-foreground">
          {book?.data?.description || "No description is available for this book yet."}
        </p>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {[
            ["Author", book?.data?.author || "Unknown"],
            ["Original Language", book?.data?.originalLanguage || "Unknown"],
            ["Active Page", page?.data?.pageNumber?.toString() || "1"],
            ["Pages Indexed", pages?.data?.length?.toString() || "0"],
          ].map(([label, value]) => (
            <div key={label} className="rounded-xl border border-border bg-muted/40 p-4">
              <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{label}</div>
              <div className="mt-1 text-sm font-semibold text-foreground">{value}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm flex flex-col justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">Quick Actions</p>
          <div className="mt-4 space-y-3 text-sm text-muted-foreground leading-relaxed">
            <p>• Jump into the reading interface to explore page versions in multiple Indian languages.</p>
            <p>• Open the translation workspace to contribute or edit translations side-by-side.</p>
            <p>• Highlight any memorable excerpt while reading to share it as a Vivar Reel.</p>
          </div>
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href={`/read/${book?.data?.uuid || ""}`}
            className="rounded-full bg-primary px-5 py-2.5 text-xs sm:text-sm font-semibold text-primary-foreground shadow-sm transition hover:bg-primary/90"
          >
            Open Reader
          </Link>
          <Link
            href={`/workspace/${book?.data?.uuid || ""}`}
            className="rounded-full border border-border px-5 py-2.5 text-xs sm:text-sm font-semibold text-foreground bg-card transition hover:bg-muted"
          >
            Translate in Studio
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OverviewTab;