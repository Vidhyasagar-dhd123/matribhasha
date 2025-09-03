"use client"

import React from "react"
import { useReader } from "../contexts/read.context"

const PageList = ({...props}:React.HTMLAttributes<HTMLDivElement>) =>{
    const {page,pages} = useReader()

    return (
        <aside className="w-full" {...props}>
                <div className="w-full overflow-x-auto bg-gray-100  min-w-[100px] flex items-center overflow-y-auto justify-center border border-gray-500  ">
                    {
                        pages?.data &&
                        pages?.data.map((page_i,key)=>{
                            return <div onClick={()=>page.set(page_i)} className="cursor-pointer border border-gray-200 bg-gray-50 px-2 py-1  text-center" key={key}>{page_i?.pageNumber}</div>
                        })
                    }
                </div>
        </aside>
    )
}

export default PageList