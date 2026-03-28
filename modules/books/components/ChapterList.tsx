import React from "react"
import {LayoutList} from 'lucide-react'

const ChapterList = ({...props}:React.HTMLAttributes<HTMLDivElement>) =>{
    return (
        <div {...props} className="absolute w-60 z-10  h-full min-h-screen   lg:relative">
            {
                ["Chapter1","Chapter2","Chapter3"].map((value,key)=>{
                    return <div className="  p-4   flex items-center" key={key}>
                        <LayoutList className="mx-4"/>
                        {value}</div>
                })
            }
        </div>
    )
}

export default ChapterList