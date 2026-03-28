import { Book } from "../utils/books";
import IndImg from "@/public/Indlang.jpg"
import Image from "next/image";
import React from "react";
import { cn } from "@/lib/utils";


type BookRibbonProps = React.HTMLAttributes<HTMLDivElement> & {
  book: Book
}

function BookRibbon({book,...props}:BookRibbonProps){
    return (
  <div
    className="
      relative flex h-full overflow-hidden rounded-lg
      bg-card text-card-foreground
      border border-border
      transition-shadow
      hover:shadow-md
      cursor-pointer
    "
    {...props}
  >
    {/* Cover */}
    <div className="flex w-1/3 md:w-full items-center justify-center bg-muted">
      <Image
        src={IndImg}
        alt={book.title}
        width={300}
        height={400}
        className={cn(
          "h-full w-full object-cover",
          props.className
        )}
      />
    </div>

    {/* Content */}
    <div className="flex w-2/3 flex-col justify-between">
      {/* Title & Author */}
      <div className="p-4 space-y-1">
        <h2 className="text-base font-semibold leading-snug">
          {book.title}
        </h2>
        <p className="text-sm text-muted-foreground italic">
          by {book.author}
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 px-4 pb-4">
        <button
          className="
            text-sm font-medium
            text-primary
            hover:underline
            transition-colors
          "
        >
          Explore
        </button>

        <button
          className="
            text-sm font-medium
            text-muted-foreground
            hover:text-foreground
            transition-colors
          "
        >
          Add to Library
        </button>
      </div>
    </div>
  </div>
);

}

export default BookRibbon