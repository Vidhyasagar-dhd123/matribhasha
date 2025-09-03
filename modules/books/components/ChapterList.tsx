import React from "react"
import {LayoutList} from 'lucide-react'

const ChapterList = ({...props}:React.HTMLAttributes<HTMLDivElement>) =>{
    return (
        <div {...props} className="absolute w-60 z-10  h-full min-h-screen bg-gray-100 border-r border-r-gray-300 lg:relative">
            {
                ["Chapter1","Chapter2","Chapter3"].map((value,key)=>{
                    return <div className="bg-gray-200 border-b border-b-gray-500 p-4 text-center text-gray-800 flex items-center" key={key}>
                        <LayoutList className="mx-4"/>
                        {value}</div>
                })
            }
        </div>
    )
}

export default ChapterList