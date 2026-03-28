"use client"
import { Suspense } from "react";
import React from "react";
import { useState,useEffect } from "react";
import { Book, BookHeaderType, BookStats } from "@/modules/books/utils/books";
import { BookHeader } from "@/modules/books/components/BookHeader";
import BooksStatBar from "@/modules/books/components/BooksStatBar";
import BookTabs from "@/modules/books/components/BookTabs";
import { Url } from "next/dist/shared/lib/router/router";

function Loading() {
  return <div className="text-center p-10">Loading book details...</div>;
}

function ErrorFallback({ error }: { error: string }) {
  return <div className="text-center p-10 ">{error}</div>;
}

function BookDescription({ params }: { params: Promise<{ id: string }> }) {
  const {id} = React.use(params);
  const [book,setBook] = useState<Book|null>(null)
  const [isLoading,setLoading] = useState(true)

  useEffect(()=>{
    const getBook = async()=>{
      const data = await fetch(`/api/v1/books/${id}`)
      if(data.ok){
        const requested_book = await data.json()
        setBook(requested_book)
      console.log(requested_book)
      }
      setLoading(false)
    }
    getBook()
  },[])

  if (!book) {
    return <ErrorFallback error="Book not found" />;
  }
    const data:BookStats = {
        originalLanguage: book.originalLanguage,
        versions: book.versions,
        contributors: book.contributors,
        totalPages: book.pages ? book.pages.length : 0,
    };
    const bookHeader:BookHeaderType={
        title: book.title,
        author: book.author,
        reviews: book.reviews,
        published: book.published,
        workspaceLink:new URL(`Workspace/${book.uuid}`,window.location.origin),
        link:new URL(`Read/${book.uuid}`,window.location.origin),
    };
    
  return (
    <div className="p-4 flex flex-col items-center bg-secondary/40 w-full overflow-x-hidden min-h-screen">
      <div className="max-w-7xl w-full flex flex-col gap-6">
        <BookHeader bookHeader={bookHeader}/>
        <BooksStatBar data={data} />
        <BookTabs/>
      </div>
    </div>
  );
}

export default BookDescription