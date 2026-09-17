import { Book } from "../utils/books";
import Image from "next/image";
import React from "react";
import { cn } from "@/lib/utils";
import { BookOpen, Plus } from "lucide-react";

type BookRibbonProps = React.HTMLAttributes<HTMLDivElement> & {
  book: Book
}

function BookRibbon({ book, className, ...props }: BookRibbonProps) {
  return (
    <div
      className={cn(
        "relative flex h-full overflow-hidden rounded-xl border border-border bg-card text-card-foreground transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 cursor-pointer",
        className
      )}
      {...props}
    >
      {/* Cover */}
      <div className="relative flex w-1/3 shrink-0 items-center justify-center bg-muted overflow-hidden">
        {book.coverURI ? (
          <Image
            src={book.coverURI}
            alt={book.title}
            fill
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-brand-subtle to-muted p-2">
            <span className="text-center text-xs font-semibold text-brand-muted leading-snug line-clamp-3">
              {book.title}
            </span>
          </div>
        )}
        {/* Language badge */}
        <span className="absolute bottom-1.5 left-1.5 rounded-md bg-foreground/80 px-1.5 py-0.5 text-[10px] font-semibold text-background backdrop-blur-sm">
          {book.originalLanguage}
        </span>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col justify-between p-4">
        {/* Title & Author */}
        <div className="space-y-1">
          {book.genre && (
            <span className="inline-block rounded-full bg-brand-subtle/60 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-brand-muted">
              {book.genre}
            </span>
          )}
          <h2 className="text-sm font-semibold leading-snug text-foreground line-clamp-2">
            {book.title}
          </h2>
          <p className="text-xs text-muted-foreground italic">
            by {book.author}
          </p>
        </div>

        {/* Actions */}
        <div className="mt-3 flex items-center gap-2">
          <button className="inline-flex items-center gap-1 rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground transition hover:bg-primary/90">
            <BookOpen size={12} />
            Explore
          </button>
          <button className="inline-flex items-center gap-1 rounded-md border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:border-foreground/30 transition">
            <Plus size={12} />
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

export default BookRibbon