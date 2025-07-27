import { useEffect, useState } from "react"

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
        <div>
            {data||"Welcome to Next"}
        </div>
    )
        
}