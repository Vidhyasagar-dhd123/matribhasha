import BookCard from "../../books/components/BookCard"
import Features from "./Features"
import Hero from "./Hero"

const Homepage=()=>{
    return (
        <div className="min-h-screen">
            <Hero></Hero>
            <Features></Features>
            <div className="flex flex-col justify-center items-center m-10">
                <h1 className="text-3xl md:text-4xl font-bold mb-12 text-gray-800">Popular Books</h1>
                <BookCard></BookCard>
            </div>
        </div>
    )
}

export default Homepage