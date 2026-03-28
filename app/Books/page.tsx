"use client"
import { Input } from "@/modules/shared/components/Input"
import {  Search } from "lucide-react"
import BookRibbon from "@/modules/books/components/BookRibbon"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Book } from "@/modules/books/utils/books"

const Books = () =>{
    const router = useRouter()
    const [Books, setBooks] = useState<Book[]>([])
    const [loading, setLoading] = useState<boolean>(true)

    useEffect(()=>{
        const getBooks = async()=>{
            const data = await fetch("/api/v1/books")
            setLoading(true)
            if(data.ok){
                const loaded_books = await data.json()
                setBooks(loaded_books)
            }
            setLoading(false)
        }
        getBooks()
    },[])

    return (
        <section className="min-h-screen flex flex-col items-center bg-secondary/40">
            <article className="w-full flex flex-col items-center max-w-7xl">
                <div className="max-w-6xl m-4 w-full p-10 flex items-center">
                    <Input className="w-full" placeholder="Search Something..."></Input>
                    <Search className="m-4 cursor-pointer"></Search>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 items-stretch auto-rows-fr ">
                    {Books && Books.map((value,key)=>{
                        return <div key={key} className="p-4 h-full flex flex-col"><BookRibbon onClick={()=>{router.push("/Books/"+value?.uuid)}} book={value}></BookRibbon></div>
                    })}
                    
                </div>
                {
                    !(Books?.length>0) && !loading &&
                    <div className="w-full text-center">
                        <div className=" p-10 md:p-20 m-10 md:m-24  rounded-md  border-x-10 ">
                            Books not found
                        </div>
                    </div>
                }
                {
                    loading &&
                    <div className="w-full text-center">
                        <div className=" p-10 md:p-20 m-10 md:m-24  rounded-md  border-x-10 ">
                            Loading...
                        </div>
                    </div>
                }
            </article>
        </section>
    )
}

export default Books