'use client'
import { Sparkles } from "lucide-react"
import Features from "./Features"
import Hero from "./Hero"
import PopularBooksByCategory from "@/modules/books/components/popular-book-section"


export default function Homepage(){
    return (
        <div className="min-h-screen">
            <Hero></Hero>
            <Features></Features>
            {/* Popular Books Catgory */}
               <div>
                {/* Pass BOOKS array to PopularBooksByCategory */}
               <PopularBooksByCategory />
            </div>
        </div>
    )
}

