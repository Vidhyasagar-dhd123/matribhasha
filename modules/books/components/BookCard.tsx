// import { Card, CardHeader, CardContent, CardTitle } from "@/modules/shared/components/cards";
// import IndImage from "@/public/WallpaperKey.jpg"
// import LangImg from "@/public/Indlang.jpg"
// import { Star,BookOpenIcon } from "lucide-react";
// import Image from "next/image";
// import Link from "next/link";

// interface Book {
//   id: number;
//   thumbnail: object;
//   name: string;
//   description: string;
//   rating: number;
//   language: string;
// }

// const books: Book[] = [
//   {
//     id: 1,
//     thumbnail: IndImage,
//     name: "The Indic Chronicles",
//     description: "A historical exploration of ancient Indic literature and translations.",
//     rating: 4.5,
//     language: "Sanskrit",
//   },
//   {
//     id: 2,
//     thumbnail: LangImg,
//     name: "Lost in Translation",
//     description: "A modern anthology showcasing the challenges of translation.",
//     rating: 4.2,
//     language: "English",
//   },
// ];

// function BookCard() {
//   return (
//     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
//       {books.map((book) => (
//         <Card key={book.id} className="rounded-xl shadow hover:shadow-lg transition max-w-[300px] relative">
//           <Image
//             src={IndImage}
//             alt={book.name}
//             className="w-full h-48 object-cover rounded-t-xl"
//             width={200}
//             height={200}
//           />
//           <CardHeader className=" rounded-t-xl w-full !p-2 overflow-clip ">
//             <CardTitle className="text-lg font-semibold ">{book.name}</CardTitle>
//             <p className="text-sm text-gray-600">{book.language}</p>
//           </CardHeader>
//           <CardContent className="!p-2 !pb-4">
//             <div className="flex justify-between items-center">
//             {/* Rating */}
//             <div className="flex items-center gap-1 ">
//               {Array.from({ length: 5 }).map((_, idx) => (
//                 <Star
//                   key={idx}
//                   size={18}
//                   className={
//                     idx < Math.round(book.rating)
//                       ? "text-yellow-500 fill-yellow-500"
//                       : "text-gray-300"
//                   }
//                 />
//               ))}
//               <span className="text-sm text-gray-500 ml-2">{book.rating.toFixed(1)}</span>
//             </div>

//             {/* Actions */}
//               <Link href={"/Books/"+book.name.replaceAll(" ",'-')}><button className="cursor-pointer"><BookOpenIcon className="h-4"></BookOpenIcon></button></Link>
//             </div>
//           </CardContent>
//         </Card>
//       ))}
//     </div>
//   );
// }

// export default BookCard

'use client'
import React, { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Star } from "lucide-react";

// Sample book type and data
type Book = {
  id: string;
  title: string;
  author: string;
  category: string;
  language: string;
  rating: number;
   image?: string;
};

const BOOKS: Book[] = [
  {
    id: "gatsby",
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    category: "Stories",
    language: "English",
    rating: 4.5,
    image: "https://m.media-amazon.com/images/I/815sgLVlc7L._UF1000,1000_QL80_.jpg"
  },
  {
    id: "atomic",
    title: "Atomic Habits",
    author: "James Clear",
    category: "Education",
    language: "English",
    rating: 4.8,
    image: "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcQyOj2jAxOLW2Xj0AC0qBwy6etynG6JwncJCXBK88gJwXyqPs-E8TLKPgCAgapYSN4UCLjxH6AwBK1YQQdVXmXgkOkRoaskEP0tBpRf6HHE-fG-goB6DjoU"
  },
  {
    id: "pride",
    title: "Pride and Prejudice",
    author: "Jane Austen",
    category: "Stories",
    language: "Hindi",
    rating: 4.7,
    image: "https://m.media-amazon.com/images/I/81Scutrtj4L._UF1000,1000_QL80_.jpg"
  },
  {
    id: "dune",
    title: "Dune",
    author: "Frank Herbert",
    category: "Science Fiction",
    language: "Bengali",
    rating: 4.8,
    image: "https://www.hachetteindia.com/Content/images/books/Large_Cover/9781473233959.jpg"
  },
  {
    id: "poems",
    title: "Selected Poems",
    author: "R. Tagore",
    category: "Poetry",
    language: "Bengali",
    rating: 4.6,
    image: "https://images-eu.ssl-images-amazon.com/images/I/61TGawR9Y0L._AC_UL900_SR615,900_.jpg"
  },
  {
    id: "mind",
    title: "Mindset",
    author: "Carol S. Dweck",
    category: "Education",
    language: "English",
    rating: 4.4,
    image: "https://rukminim2.flixcart.com/image/480/640/xif0q/regionalbooks/g/u/b/mindset-changing-the-way-you-think-to-fulfil-your-potential-original-imaggy76cx8fa4wg.jpeg?q=90"
  },
];

const CATEGORIES = ["All", "Education", "Stories", "Poetry", "Science Fiction"];

function LanguageBadge({ language }: { language: string }) {
  // Map language to Tailwind color classes
  const colorMap: Record<string, string> = {
    English: "bg-emerald-100 text-emerald-800",
    Hindi: "bg-amber-100 text-amber-800",
    Bengali: "bg-rose-100 text-rose-800",
    default: "bg-slate-100 text-slate-800",
  };
  const classes = colorMap[language as keyof typeof colorMap] || colorMap.default;

  return (
    <Badge className={`rounded-md px-3 py-1 font-medium ${classes}`}>{language}</Badge>
  );
}

function StarRating({ value }: { value: number }) {
  const full = Math.floor(value);
  const half = value - full >= 0.5;
  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => {
          const idx = i + 1;
          const filled = idx <= full || (half && idx === full + 1);
          return (
            <Star
              key={i}
              size={14}
              className={`${filled ? "text-yellow-500" : "text-slate-300"}`}
            />
          );
        })}
      </div>
      <span className="text-sm text-slate-600">{value.toFixed(1)}</span>
    </div>
  );
}

export default function PopularBooksByCategory() {
  const [activeCategory, setActiveCategory] = useState<string>("All");

  const filtered = useMemo(() => {
    if (activeCategory === "All") return BOOKS;
    return BOOKS.filter((b) => b.category === activeCategory);
  }, [activeCategory]);

  return (
    <section className="w-full max-w-8xl mx-auto p-6">
      

      <Tabs defaultValue={activeCategory} onValueChange={(v) => setActiveCategory(v)}>
        <div className="w-full  flex  justify-center items-center gap-5">
        <TabsList className="rounded-lg  p-1 flex gap-1 mb-6 ">
          {CATEGORIES.map((c) => (
            <TabsTrigger
              key={c}
              value={c}
              className={`px-7 py-6 rounded-full mx-4 border font-bold whitespace-nowrap transition-all duration-200
  ${
    activeCategory === c
      ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 shadow-sm border-rose-500"
      : "text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 hover:shadow-sm"
  }`}
            >
              {c}
            </TabsTrigger>
          ))}
        </TabsList>
        </div>

        {/* Responsive grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4 ">
          {filtered.map((book) => (
            <Card className="flex rounded-xl flex-col shadow-none hover:border-rose-500 hover:shadow-lg hover:scale-105 transition-transform transition-shadow transition-colors duration-300">
              <CardHeader className="flex items-start gap-4">
                {/* Book cover placeholder */}
                 <div className="w-24 h-36 rounded-md flex-shrink-0 overflow-hidden bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center">
          {book.image ? (
            <img
              src={book.image}
              alt={book.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="text-sm font-semibold text-slate-700 px-2 text-center">
              {book.title
                ? book.title.split(" ").slice(0, 2).map((s) => s.charAt(0)).join("")
                : ""}
            </div>
          )}
        </div>
                <div className="flex-1 ">
                  <CardTitle className="text-lg font-semibold leading-tight">{book.title}</CardTitle>
                  <p className="text-sm text-slate-500 mt-1">Author : <span className="">{book.author}</span></p>

                  {/* <div className="mt-3 flex items-center gap-3">
                    <LanguageBadge language={book.language} />
                    <div className="ml-auto">
                      <StarRating value={book.rating} />
                    </div>
                  </div> */}
                </div>
              </CardHeader>

              <CardContent className="flex-1 mt-3">
                {/* Short description placeholder */}
                <p className="text-sm text-slate-600">A short 1–2 line description can live here to entice the reader.</p>
              </CardContent>

              <CardFooter className="pt-4">
                <div className="w-full flex items-center justify-between">
                  <Button variant="ghost" className="px-3 py-2 rounded-md">
                    Read more
                  </Button>
                  <Button className="px-4 py-2 rounded-md">Add to cart</Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      </Tabs>

      {/* Small mobile sticky tab - optional */}
      <div className="sm:hidden fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-white p-2 rounded-xl shadow-lg">
        <select
          className="block w-64 appearance-none rounded-md border border-slate-200 px-3 py-2"
          value={activeCategory}
          onChange={(e) => setActiveCategory(e.target.value)}
        >
          {CATEGORIES.map((c) => (
            <option value={c} key={c}>
              {c}
            </option>
          ))}
        </select>
      </div>
    </section>
  );
}
