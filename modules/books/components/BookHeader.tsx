import { PlusIcon, PenIcon, BookOpen, Globe } from "lucide-react";
import { BookHeaderType } from "../utils/books";
import Link from "next/link";
import Image from "next/image";

export const BookHeader = ({ bookHeader }: { bookHeader: BookHeaderType }) => {
  return (
    <div
      className="
        relative flex flex-col gap-6 rounded-2xl
        border border-border bg-card text-card-foreground
        p-6 shadow-sm
        md:flex-row md:items-stretch
      "
    >
      {/* Cover Image */}
      <div className="relative h-64 sm:h-72 w-full md:w-52 shrink-0 overflow-hidden rounded-xl bg-muted border border-border/80 shadow-md">
        {bookHeader.coverURI ? (
          <Image
            src={bookHeader.coverURI}
            alt={bookHeader.title}
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-primary/15 via-muted to-background p-4 text-center">
            <Globe className="h-10 w-10 text-primary/40 mb-2" />
            <span className="text-sm font-bold text-foreground line-clamp-3">
              {bookHeader.title}
            </span>
            <span className="mt-2 text-xs text-muted-foreground uppercase font-mono">
              {bookHeader.originalLanguage || "Original Edition"}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col justify-between py-1">
        {/* Metadata */}
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            {bookHeader.genre && (
              <span className="rounded-md bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary uppercase tracking-wider">
                {bookHeader.genre}
              </span>
            )}
            {bookHeader.originalLanguage && (
              <span className="rounded-md bg-secondary px-2.5 py-0.5 text-xs font-medium text-secondary-foreground uppercase font-mono">
                {bookHeader.originalLanguage}
              </span>
            )}
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            {bookHeader.title}
          </h1>

          <p className="text-base text-muted-foreground">
            By <strong className="text-foreground font-semibold">{bookHeader.author}</strong>
          </p>

          {bookHeader.description && (
            <p className="text-xs sm:text-sm text-muted-foreground line-clamp-3 leading-relaxed">
              {bookHeader.description}
            </p>
          )}

          {/* Published / Reviews */}
          <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground pt-1">
            {bookHeader.published ? (
              <span>Published {bookHeader.published}</span>
            ) : null}
            {bookHeader.reviews ? (
              <>
                {bookHeader.published ? <span>·</span> : null}
                <Link
                  href={`${typeof window !== "undefined" ? window.location.pathname : ""}?tab=reviews`}
                  className="text-amber-500 font-semibold inline-flex items-center gap-1 hover:underline"
                >
                  <span>★</span>
                  <span>{bookHeader.reviews}</span>
                  <span className="text-muted-foreground font-normal ml-0.5">reviews</span>
                </Link>
              </>
            ) : (
              <Link
                href={`${typeof window !== "undefined" ? window.location.pathname : ""}?tab=reviews`}
                className="text-xs text-primary font-medium hover:underline"
              >
                ★ Add first review
              </Link>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <Link href={bookHeader.link}>
            <button
              className="
                rounded-xl bg-primary px-5 py-2.5
                text-xs sm:text-sm font-semibold text-primary-foreground
                hover:bg-primary/90 shadow-sm
                transition inline-flex items-center gap-2
                cursor-pointer
              "
            >
              <BookOpen size={16} />
              <span>Start Reading</span>
            </button>
          </Link>

          <Link href={bookHeader.workspaceLink}>
            <button
              className="
                rounded-xl border border-border bg-card px-4 py-2.5
                text-xs sm:text-sm font-semibold text-foreground
                hover:bg-muted
                transition inline-flex items-center gap-2
                cursor-pointer
              "
            >
              <PenIcon size={14} />
              <span>Contribute Translation</span>
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};