import React from "react"
import {LayoutList} from 'lucide-react'

const ChapterList = ({...props}:React.HTMLAttributes<HTMLDivElement>) =>{
    return (
        <div {...props} className="absolute w-60 z-10  h-full min-h-screen bg-[var(--sidebar-primary)] border-r lg:relative">
            {
                ["Chapter1","Chapter2","Chapter3"].map((value,key)=>{
                    return <div className="bg-[var(--secondary)] border-b p-4 text-center text-[var(--secondary-foreground)] flex items-center" key={key}>
                        <LayoutList className="mx-4"/>
                        {value}</div>
                })
            }
        </div>
    )
}

export default ChapterList