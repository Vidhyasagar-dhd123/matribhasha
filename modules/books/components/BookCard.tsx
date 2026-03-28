import { Card, CardHeader, CardContent, CardTitle } from "@/modules/shared/components/cards";
import IndImage from "@/public/WallpaperKey.jpg"
import LangImg from "@/public/Indlang.jpg"
import { Star,BookOpenIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface Book {
  id: number;
  thumbnail: object;
  name: string;
  description: string;
  rating: number;
  language: string;
}

const books: Book[] = [
  {
    id: 1,
    thumbnail: IndImage,
    name: "The Indic Chronicles",
    description: "A historical exploration of ancient Indic literature and translations.",
    rating: 4.5,
    language: "Sanskrit",
  },
  {
    id: 2,
    thumbnail: LangImg,
    name: "Lost in Translation",
    description: "A modern anthology showcasing the challenges of translation.",
    rating: 4.2,
    language: "English",
  },
];

function BookCard() {
return (
  <div className="mx-auto max-w-7xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 px-6 py-8">
    {books.map((book) => (
      <Card
        key={book.id}
        className="
          relative overflow-hidden rounded-xl
          bg-card text-card-foreground
          border border-border
          transition-shadow
          hover:shadow-md
        "
      >
        {/* Cover */}
        <Image
          src={IndImage}
          alt={book.name}
          width={300}
          height={200}
          className="
            h-48 w-full object-cover
            border-b border-border
          "
        />

        {/* Header */}
        <CardHeader className="px-4 pt-3 pb-2">
          <CardTitle className="text-base font-semibold leading-snug">
            {book.name}
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            {book.language}
          </p>
        </CardHeader>

        {/* Footer */}
        <CardContent className="px-4 pb-4 pt-2">
          <div className="flex items-center justify-between">
            
            {/* Rating */}
            <div className="flex items-center gap-1 text-muted-foreground">
              {Array.from({ length: 5 }).map((_, idx) => (
                <Star
                  key={idx}
                  size={16}
                  className={
                    idx < Math.round(book.rating)
                      ? "fill-primary text-primary"
                      : "text-muted-foreground"
                  }
                />
              ))}
              <span className="ml-2 text-sm">
                {book.rating.toFixed(1)}
              </span>
            </div>

            {/* Read Action */}
            <Link
              href={`/Books/${book.name.replaceAll(" ", "-")}`}
              className="
                inline-flex items-center gap-1
                text-sm font-medium
                text-muted-foreground
                hover:text-foreground
                transition-colors
              "
            >
              <BookOpenIcon className="h-4 w-4" />
              Read
            </Link>
          </div>
        </CardContent>
      </Card>
    ))}
  </div>
);

}

export default BookCard