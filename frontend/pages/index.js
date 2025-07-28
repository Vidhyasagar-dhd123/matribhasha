import { useEffect, useState } from "react"
import NavBar from "../components/NavBar";
import Hero from "../components/Hero";
export default function Home(){
    const [data, setData] = useState("")
   useEffect(()=>{
    async function fetchData(){
        const response = await fetch("http://localhost:3000/");
        const text = await response.text()
        setData(text)
    }
    fetchData()
   })
    return (
        <div class="w-full min-h-full">
            <Hero className="bg-white  h-screen p-0 sm:p-4"></Hero>
            {data||"Welcome to Next"}
        </div>
    )
        
}