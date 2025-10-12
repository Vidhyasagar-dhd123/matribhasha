'use client'

import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookIcon, BookOpen, CheckCheck, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

interface Book {
  id: string;
  name: string;
  author: string;
  category: string;
  language: string;
  rating: number;
  image?: string;
}

// Badge for book language
function LanguageBadge({ language }: { language: string }) {
  const colorMap: Record<string, string> = {
    English: "bg-emerald-100 text-emerald-800",
    Hindi: "bg-amber-100 text-amber-800",
    Bengali: "bg-rose-100 text-rose-800",
    default: "bg-slate-100 text-slate-800",
  };
  const classes = colorMap[language as keyof typeof colorMap] || colorMap.default;
  return <Badge className={`rounded-2xl px-3 py-1 font-medium  ${classes}`}> <CheckCheck className="h-5 w-5" />{language}</Badge>;
}

// Star rating component
function StarRating({ value }: { value: number }) {
  const full = Math.floor(value);
  const half = value - full >= 0.5;
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, i) => {
        const idx = i + 1;
        const filled = idx <= full || (half && idx === full + 1);
        return <Star key={i} size={14} className={filled ? "text-yellow-500" : "text-slate-800"} />;
      })}
      <span className="text-sm text-slate-600">{value.toFixed(1)}</span>
    </div>
  );
}

export default function BookCard({ book }: { book: Book }) {
  if (!book) return null;
  return (
    <Card className="flex flex-col rounded-xl shadow-none hover:border-rose-500 hover:shadow-lg hover:scale-105 transition-transform duration-300 ">
      <CardHeader className="flex items-start gap-4">
        <div className="w-24 h-36 rounded-md flex-shrink-0 border  overflow-hidden bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center">
          {book.image ? (
            <img src={book.image} alt={book.name} className="w-full h-full object-cover" />
          ) : (
            <div className="text-sm font-semibold text-slate-700 px-2 text-center">
              {book.name.split(" ").slice(0, 2).map((s) => s.charAt(0)).join("")}
            </div>
          )}
        </div>
        <div className="flex-1">
          <CardTitle className="text-lg font-semibold leading-tight">{book.name}</CardTitle>
          <p className="text-sm text-muted-foreground mt-1  ">by {book.author}</p>
          <div className="mt-3   gap-3">
            <LanguageBadge language={book.language} />
            <div className="mt-1">
              <StarRating value={book.rating} />
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 mt-3 text-sm text-slate-600">
        A short description can go here to entice readers.
      </CardContent>

      <CardFooter className="pt-4">
        <div className="w-full flex items-center justify-between">
          <Button variant="ghost" className="px-3 py-2 rounded-full border border-rose-500 hover:bg-rose-500 hover:text-white">Read more</Button>
          <Button className="px-3 py-2 border rounded-full hover:bg-rose-500 hover:text-white border-gray-200 hover:bg-rose-500">
            <Link href={`/Books/${book.name.replaceAll(" ", "-")}`} className="flex gap-3 items-center">
            <BookOpen/> Preview
            </Link>
          </Button></div>
      </CardFooter>
    </Card>
  );
}
