"use client"

import React, { useEffect } from "react"
import { useReader } from "../contexts/read.context"

const PageList = ({...props}:React.HTMLAttributes<HTMLDivElement>) =>{
    const {page,pages,authors,language} = useReader()

    useEffect(()=>{
        //check whether language is in author.data.language
        if (authors?.data && language.data && !authors.data.some(author => author.language === language.data)) {
            language.set(page?.data?.originalLanguage||"en");
            window.alert("Page is not available in your language showing results in " + page?.data?.originalLanguage+" instead.");
        }
    },[pages,authors,language])

    return (
        <aside className="w-full bg-background" {...props}>
                <div className="w-full overflow-x-auto   min-w-[100px] flex items-center overflow-y-auto justify-center border   ">
                    {
                        pages?.data &&
                        pages?.data.map((page_i,key)=>{
                            return <div onClick={()=>page.set(page_i)} className="cursor-pointer border   px-2 py-1  " key={key}>{page_i?.pageNumber}</div>
                        })
                    }
                </div>
        </aside>
    )
}

export default PageList