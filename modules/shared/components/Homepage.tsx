'use client'
import { Sparkles } from "lucide-react"
import PopularBooksByCategory from "../../books/components/BookCard"
import Features from "./Features"
import Hero from "./Hero"


export default function Homepage(){
    return (
        <div className="min-h-screen">
            <Hero></Hero>
            <Features></Features>
            {/* Popular Books Catgory */}
               <div>
                <div className="flex flex-col items-center justify-center text-center py-8">
                    <div className="inline-flex items-center gap-2 bg-white rounded-full px-6 py-2 shadow-lg mb-7">
                        <Sparkles className="w-5 h-5 text-orange-500" />
                        <span className="text-sm font-semibold text-gray-700">Popular Books</span>
                    </div>
                    <h2 className="text-3xl sm:text-4xl font-bold text-center mb-2">
                        Popular Books by Category
                    </h2>
                </div>

                {/* Pass BOOKS array to PopularBooksByCategory */}
                <PopularBooksByCategory />
            </div>
        </div>
    )
}

