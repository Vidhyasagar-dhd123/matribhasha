import { Book } from "../utils/books";
import IndImg from "@/public/Indlang.jpg"
import Image from "next/image";
import { cn } from "@/lib/utils";
import React from "react";

function BookRibbon({book,...props}:{book:Book}){
    return(
        <div className="w-full hover:shadow-lg shadow-white" {...props}>
            <div className="flex hover:shadow-lg">
                <div className="bg-blue-400 p-1 md:p-2 flex items-center">
                    <Image className="" src={IndImg} height={100} width={100} alt="Book Cover"/>
                </div>
                <div className="p-2 bg-white w-full">
                    <h3 className="text-lg font-bold">{book.title}</h3>
                    <p className="italic font-light text-sm text-gray-700">{book.author}</p>
                </div>
            </div>
        </div>
    )
}

export default BookRibbon