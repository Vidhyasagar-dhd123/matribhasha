import { PlusIcon, PenIcon } from "lucide-react";
import { BookHeaderType } from "../utils/books";
import Link from "next/link";

export const BookHeader = ({bookHeader}:{bookHeader:BookHeaderType}) => {
    return (
  <div
    className="
      relative flex flex-col gap-6 rounded-xl
      border border-border bg-background text-card-foreground
      p-6 shadow-sm
      md:flex-row
    "
  >
    {/* Cover */}
    <div className="flex h-64 w-full items-center justify-center rounded-lg bg-muted md:w-1/4">
      <span className="text-sm text-muted-foreground">
        Space for Image
      </span>
    </div>

    {/* Content */}
    <div className="flex flex-1 flex-col justify-between">
      {/* Metadata */}
      <div className="space-y-2">
        <h2 className="text-xl font-semibold leading-tight">
          {bookHeader.title}
        </h2>

        <p className="text-sm italic text-muted-foreground">
          by {bookHeader.author}
        </p>

        <p className="text-sm text-muted-foreground">
          <span>Fiction</span>
          <span className="mx-2">·</span>
          <span>Published {bookHeader.published}</span>
        </p>

        {/* Rating */}
        <div className="flex items-center gap-2 text-sm">
          <span className="text-primary">
            {"★".repeat(parseInt(bookHeader.reviews))}
          </span>
          <span className="text-muted-foreground">
            {bookHeader.reviews}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-6 flex flex-wrap items-center gap-4">
        <Link href={bookHeader.link}>
          <button
            className="
              rounded-md bg-primary px-4 py-2
              text-sm font-medium text-primary-foreground
              hover:bg-primary/90
              transition-colors
                cursor-pointer
            "
          >
            Start Reading
          </button>
        </Link>

        <button
          className="
            rounded-md border border-border px-4 py-2
            text-sm font-medium text-muted-foreground
            hover:text-foreground hover:border-ring
            transition-colors
            cursor-pointer
          "
        >
          <PlusIcon className="mr-1 inline h-4 w-4" />
          Add Translation
        </button>
      </div>
    </div>

    {/* Edit Action */}
    <div className="absolute right-4 top-4">
      <Link href={bookHeader.workspaceLink}>
        <button
          className="
            inline-flex items-center gap-1
            rounded-md border border-border
            px-3 py-1
            text-xs font-medium text-muted-foreground
            hover:text-foreground hover:border-ring
            transition-colors
            cursor-pointer
          "
        >
          <PenIcon className="h-3 w-3" />
          Edit
        </button>
      </Link>
    </div>
  </div>
);

}