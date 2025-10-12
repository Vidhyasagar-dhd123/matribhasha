'use client'
import React, { useState, useMemo } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BookCard from "./BookCard";
import { Sparkles } from "lucide-react";

// Sample Book type
type Book = {
    id: string;
    name: string;
    author: string;
    category: string;
    language: string;
    rating: number;
    image?: string;
};

// Sample Books data
const BOOKS: Book[] = [
    {
        id: "gatsby",
        name: "The Great Gatsby",
        author: "F. Scott Fitzgerald",
        category: "Stories",
        language: "English",
        rating: 4.5,
        image: "https://m.media-amazon.com/images/I/815sgLVlc7L._UF1000,1000_QL80_.jpg"
    },
    {
        id: "atomic",
        name: "Atomic Habits",
        author: "James Clear",
        category: "Education",
        language: "English",
        rating: 4.8,
        image: "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcQyOj2jAxOLW2Xj0AC0qBwy6etynG6JwncJCXBK88gJwXyqPs-E8TLKPgCAgapYSN4UCLjxH6AwBK1YQQdVXmXgkOkRoaskEP0tBpRf6HHE-fG-goB6DjoU"
    },
    {
        id: "pride",
        name: "Pride and Prejudice",
        author: "Jane Austen",
        category: "Stories",
        language: "Hindi",
        rating: 4.7,
        image: "https://m.media-amazon.com/images/I/81Scutrtj4L._UF1000,1000_QL80_.jpg"
    },
    {
        id: "dune",
        name: "Dune",
        author: "Frank Herbert",
        category: "Science Fiction",
        language: "Bengali",
        rating: 4.8,
        image: "https://www.hachetteindia.com/Content/images/books/Large_Cover/9781473233959.jpg"
    },
    {
        id: "poems",
        name: "Selected Poems",
        author: "R. Tagore",
        category: "Poetry",
        language: "Bengali",
        rating: 4.6,
        image: "https://images-eu.ssl-images-amazon.com/images/I/61TGawR9Y0L._AC_UL900_SR615,900_.jpg"
    },
    {
        id: "mind",
        name: "Mindset",
        author: "Carol S. Dweck",
        category: "Education",
        language: "English",
        rating: 4.4,
        image: "https://rukminim2.flixcart.com/image/480/640/xif0q/regionalbooks/g/u/b/mindset-changing-the-way-you-think-to-fulfil-your-potential-original-imaggy76cx8fa4wg.jpeg?q=90"
    },
];

// Categories
const CATEGORIES = ["All", "Education", "Stories", "Poetry", "Science Fiction"];

export default function PopularBooksByCategory() {
    const [activeCategory, setActiveCategory] = useState<string>("All");

    const filteredBooks = useMemo(() => {
        if (activeCategory === "All") return BOOKS;
        return BOOKS.filter((book) => book.category === activeCategory);
    }, [activeCategory]);

    return (
        <div className="w-full max-w-8xl mx-auto p-6 overflow-hidden relative">
             <div className="flex flex-col items-center justify-center text-center py-8">
                    <div className="inline-flex items-center gap-2 bg-white rounded-full px-6 py-2 shadow-lg mb-7">
                        <Sparkles className="w-5 h-5 text-orange-500" />
                        <span className="text-sm font-semibold text-gray-700">Popular Books</span>
                    </div>
                    <h2 className="text-3xl sm:text-4xl font-bold text-center mb-2">
                        Popular Books by Category
                    </h2>
                </div>

             <div className="absolute inset-0 opacity-10">
                        {[
                            "from-blue-500 to-purple-500 -top-48 -right-48",
                            "from-yellow-500 to-orange-500 top-1/2 right-0",
                            "from-orange-500 to-rose-500 bottom-0 left-1/3",
                             "from-blue-500 to-purple-500 -top-48 -left-48"
                        ].map((gradient, index) => (
                            <div
                                key={index}
                                className={`absolute w-96 h-96 bg-gradient-to-r ${gradient} rounded-full blur-3xl`}
                            />
                        ))}
                    </div>
            {/* Tabs */}
            <Tabs defaultValue={activeCategory} onValueChange={setActiveCategory}>
                <div className="flex justify-center mb-6">
                    <TabsList className="rounded-lg p-1 flex gap-1">
                        {CATEGORIES.map((category) => (
                            <TabsTrigger
                                key={category}
                                value={category}
                                className={`px-6 py-6 rounded-full mx-6 font-bold transition-all duration-200 ${activeCategory === category
                                    ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 shadow-sm border-rose-500"
                                    : "text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 hover:shadow-sm"
                                    }`}
                            >
                                {category}
                            </TabsTrigger>
                        ))}
                    </TabsList>
                </div>
               
                   
               
                {/* Book Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
                    {filteredBooks.map((book) => (
                        <BookCard key={book.id} book={book} />
                    ))}
                </div>
            </Tabs>

            {/* Mobile Dropdown for smaller screens */}
            <div className="sm:hidden fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-white p-2 rounded-xl shadow-lg">
                <select
                    className="block w-64 appearance-none rounded-md border border-slate-200 px-3 py-2"
                    value={activeCategory}
                    onChange={(e) => setActiveCategory(e.target.value)}
                >
                    {CATEGORIES.map((category) => (
                        <option key={category} value={category}>{category}</option>
                    ))}
                </select>
            </div>
        </div>
    );
}
