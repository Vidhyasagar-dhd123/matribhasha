import { Book } from "../utils/books";
import IndImg from "@/public/Indlang.jpg"
import Image from "next/image";
import React from "react";


type BookRibbonProps = React.HTMLAttributes<HTMLDivElement> & {
  book: Book
}

function BookRibbon({book,...props}:BookRibbonProps){
    return(
        <div className="w-full hover:shadow-lg " {...props}>
            <div className="cursor-pointer flex hover:shadow-lg hover:shadow-gray-300 bg-white dark:bg-gray-800 rounded-2xl shadow-white dark:shadow-none hover:dark:bg-gray-900">
                <div className="bg-blue-400 dark:bg-blue-800 flex items-center rounded-l-2xl">
                    <Image className="rounded-l-2xl ml-0.5 h-full" src={IndImg} height={100} width={100} alt="Book Cover"/>
                </div>
                <div className="p-2 w-full">
                    <h3 className="text-lg font-bold">{book.title}</h3>
                    <p className="italic font-light text-sm text-gray-700 dark:text-gray-300">{book.author}</p>
                </div>
            </div>
        </div>
    )
}

export default BookRibbon