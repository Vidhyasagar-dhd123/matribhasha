"use client"
import { Suspense } from "react";
import React from "react";
import { useState,useEffect } from "react";
import { Edit } from "lucide-react";
import BookCover from "@/modules/books/components/BookCover";
import StatsGrid from "@/modules/books/components/StatsGrid";
import ActionButtons from "@/modules/books/components/ActionButtons";
import AboutSection from "@/modules/books/components/AboutSection";

function Loading() {
  return <div className="text-center p-10">Loading book details...</div>;
}

function ErrorFallback({ error }: { error: string }) {
  return <div className="text-center p-10 text-red-500">{error}</div>;
}

function BookDescription({ params }: { params: Promise<{ id: string }> }) {
  const {id} = React.use(params);
  const [book,setBook] = useState({})
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

  const title = book.title; // Derived for cleanliness
  return (
    <section className="bg-gray-50 min-h-screen flex flex-col items-center py-8">
      <div className="flex flex-col items-center max-w-6xl w-full px-4">
        <article className="w-full p-4 bg-white mb-4 rounded flex justify-between items-center shadow">
          <h1 className="text-2xl font-bold capitalize">{title}</h1>
          <button aria-label="Edit book details">
            <Edit className="text-gray-600 hover:text-gray-800" />
          </button>
        </article>
        <article className="mb-5 rounded-2xl flex flex-col md:flex-row justify-center items-center md:items-start md:justify-start gap-6">
          <BookCover book={book} />
          <div className="p-6 md:p-10">
            <Suspense fallback={<Loading />}>
              <StatsGrid book={book} />
            </Suspense>
          </div>
          <Suspense fallback={<Loading />}>
            <ActionButtons id={book?.uuid} />
          </Suspense>
        </article>
        <Suspense fallback={<Loading />}>
          <AboutSection book={book} />
        </Suspense>
      </div>
    </section>
  );
}

export default BookDescription