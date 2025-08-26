import React from "react"

const ChapterList = ({...props}:React.HTMLAttributes<HTMLDivElement>) =>{
    return (
        <div {...props} className="absolute w-60 z-10  h-full min-h-screen bg-blue-100 border-r border-r-blue-300 lg:relative">
            {
                ["Chapter1","Chapter2","Chapter3"].map((value,key)=>{
                    return <div className="bg-blue-200 border-b border-b-blue-500 p-4 text-center text-blue-800 " key={key}>{value}</div>
                })
            }
        </div>
    )
}

export default ChapterList