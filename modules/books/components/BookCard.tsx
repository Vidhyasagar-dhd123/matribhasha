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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      {books.map((book) => (
        <Card key={book.id} className="rounded-xl shadow hover:shadow-lg transition max-w-[300px] relative">
          <Image
            src={IndImage}
            alt={book.name}
            className="w-full h-48 object-cover rounded-t-xl"
            width={200}
            height={200}
          />
          <CardHeader className=" rounded-t-xl w-full !p-2 overflow-clip ">
            <CardTitle className="text-lg font-semibold ">{book.name}</CardTitle>
            <p className="text-sm text-gray-600">{book.language}</p>
          </CardHeader>
          <CardContent className="!p-2 !pb-4">
            <div className="flex justify-between items-center">
            {/* Rating */}
            <div className="flex items-center gap-1 ">
              {Array.from({ length: 5 }).map((_, idx) => (
                <Star
                  key={idx}
                  size={18}
                  className={
                    idx < Math.round(book.rating)
                      ? "text-yellow-500 fill-yellow-500"
                      : "text-gray-300"
                  }
                />
              ))}
              <span className="text-sm text-gray-500 ml-2">{book.rating.toFixed(1)}</span>
            </div>

            {/* Actions */}
              <Link href={"/Books/"+book.name.replaceAll(" ",'-')}><button className="cursor-pointer"><BookOpenIcon className="h-4"></BookOpenIcon></button></Link>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default BookCard