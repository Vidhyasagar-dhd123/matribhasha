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
        <div class="w-full">
            <NavBar></NavBar>
            <Hero className="container"></Hero>
            {data||"Welcome to Next"}
        </div>
    )
        
}