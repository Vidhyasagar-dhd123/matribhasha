import Link from "next/link";
import { useReader } from "../contexts/read.context";

const ReadTab = () => {
  const { content, page, book } = useReader();

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">Page Preview</p>
            <h3 className="mt-1 text-xl font-bold text-foreground">
              Page {page?.data?.pageNumber || 1}
            </h3>
          </div>
          <Link
            href={`/read/${book?.data?.uuid || ""}`}
            className="rounded-full border border-border px-4 py-2 text-xs font-semibold text-foreground bg-background transition hover:bg-muted"
          >
            Open Full Reader &rarr;
          </Link>
        </div>
        <div className="mt-5 rounded-xl border border-border bg-muted/30 p-5 text-sm leading-8 text-foreground whitespace-pre-wrap">
          {content?.data?.content || "Select a page from the reader to load content here."}
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <div className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">Reader Notes</div>
        <ul className="mt-4 space-y-3 text-sm leading-6 text-muted-foreground">
          <li>• Content automatically syncs as you switch languages.</li>
          <li>• Use the translation studio to contribute new regional versions.</li>
          <li>• Highlight any quote in the reader to share a Vivar Reel.</li>
        </ul>
      </div>
    </div>
  );
};

export default ReadTab;