"use client"
import { Input } from "@/modules/shared/components/Input"
import {  Search } from "lucide-react"
import BookRibbon from "@/modules/books/components/BookRibbon"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

const Books = () =>{
    const router = useRouter()
    const [Books, setBooks] = useState(
        [])

    useEffect(()=>{
        const getBooks = async()=>{
            const data = await fetch("/api/v1/books")
            if(data.ok){
                const loaded_books = await data.json()
                setBooks(loaded_books)
            }
        }
        getBooks()
    },[])

    return (
        <section className="bg-gray-50 min-h-screen flex flex-col items-center">
            <article className="max-w-6xl w-full">
                <div className="max-w-6xl m-4 w-full p-10 flex items-center">
                    <Input className="w-full" placeholder="Search Something..."></Input>
                    <Search className="m-4 cursor-pointer"></Search>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 items-stretch">
                    {Books && Books.map((value,key)=>{
                        return <div key={key} className="p-4"><BookRibbon onClick={()=>{router.push("/Books/"+value.uuid)}} book={value}></BookRibbon></div>
                    })}
                </div>
            </article>
        </section>
    )
}

export default Books