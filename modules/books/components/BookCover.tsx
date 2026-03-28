import { Book } from "../utils/books";
import IndImg from "@/public/Indlang.jpg"
import Image from "next/image";
import { cn } from "@/lib/utils";

type BookCoverProps = React.HTMLAttributes<HTMLDivElement> & {
  book: Book
}

function BookCover({ book,...props }:BookCoverProps) {
  return (
    <div className=" rounded-lg flex w-[500px] h-full">
      <div className="w-[30%] h-full">
        <Image src={IndImg} alt={book.title} width={300} height={400} className={cn("rounded-l min-h-max",props.className)} />
      </div>
      <div className="flex flex-col justify-between h-full">
        <div className="p-4 flex flex-col gap-2">
          <h2 className=" font-bold">{book.title}</h2>
          <p className=" italic">by {book.author}</p>
        </div>
        <div>
          <button className="m-4 px-4 py-2   rounded hover: hover: transition cursor-pointer hover:border hover:">Read Now</button>
          <button className="m-4 px-4 py-2 border   rounded hover: hover: transition cursor-pointer">Add to Library</button> 
        </div>
      </div>
    </div>
  );
}

export default BookCover