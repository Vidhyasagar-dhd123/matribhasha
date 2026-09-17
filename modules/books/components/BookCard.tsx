import React from "react";
import Image from "next/image";
import Link from "next/link";
import { BookOpen, Globe } from "lucide-react";
import { Book } from "../utils/books";

interface BookCardProps {
  book: Partial<Book> & { title: string; originalLanguage: string; author: string; uuid: string };
}

export function BookCard({ book }: BookCardProps) {
  return (
    <div className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border bg-card text-card-foreground shadow-sm transition hover:-translate-y-1 hover:shadow-md">
      {/* Cover / Header */}
      <div className="relative h-44 w-full overflow-hidden bg-muted">
        {book.coverURI ? (
          <Image
            src={book.coverURI}
            alt={book.title}
            fill
            className="object-cover transition duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-primary/10 via-muted to-background p-4 text-center">
            <Globe className="h-8 w-8 text-primary/40 mb-2" />
            <span className="text-sm font-semibold text-foreground line-clamp-2">{book.title}</span>
          </div>
        )}
        <span className="absolute bottom-2 left-2 rounded-md bg-background/90 px-2 py-0.5 text-xs font-semibold text-foreground backdrop-blur-sm shadow-xs uppercase">
          {book.originalLanguage}
        </span>
        {book.genre && (
          <span className="absolute top-2 right-2 rounded-md bg-primary/90 px-2 py-0.5 text-[10px] font-semibold text-primary-foreground backdrop-blur-sm uppercase">
            {book.genre}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col justify-between p-4">
        <div>
          <h3 className="text-base font-bold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
            {book.title}
          </h3>
          <p className="mt-1 text-xs text-muted-foreground italic">
            by {book.author}
          </p>
          {book.description && (
            <p className="mt-2 text-xs text-muted-foreground line-clamp-2">
              {book.description}
            </p>
          )}
        </div>

        {/* Action buttons */}
        <div className="mt-4 flex items-center justify-between border-t border-border/60 pt-3">
          <Link
            href={`/books/${book.uuid}`}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
          >
            <BookOpen size={13} />
            Explore Book
          </Link>
          <Link
            href={`/workspace/${book.uuid}`}
            className="rounded-lg bg-secondary px-2.5 py-1 text-xs font-medium text-secondary-foreground hover:bg-muted transition"
          >
            Translate
          </Link>
        </div>
      </div>
    </div>
  );
}

export default BookCard;