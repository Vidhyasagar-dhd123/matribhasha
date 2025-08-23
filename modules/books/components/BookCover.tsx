import { Book } from "../utils/books";
import IndImg from "@/public/Indlang.jpg"
import Image from "next/image";
import { cn } from "@/lib/utils";
function BookCover({ book,...props }: { book: Book }) {
  return (
    <div className={cn("bg-white h-full flex flex-col rounded-2xl shadow-lg",props.className)} {...props}>
      <Image
        src={IndImg}
        alt={`Cover of ${book.title}`}
        height={400}
        width={300}
        className="rounded-t-2xl object-cover"
        priority
      />
      <div className="p-4 h-full bg-blue-400 rounded-b-2xl">
        <h1 className="text-lg font-bold text-white">{book.title}</h1>
        <p className="pl-2 text-sm text-blue-100">By {book.author}</p>
      </div>
    </div>
  );
}

export default BookCover