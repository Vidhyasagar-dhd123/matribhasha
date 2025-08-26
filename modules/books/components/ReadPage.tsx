import { useEffect, useState } from "react"
import { useReader } from "../contexts/read.context"


const ReadPage = () =>{
    const {content,page, book,author,language} = useReader()
    useEffect(()=>{
        const getPageVersion=async()=>{
            console.log("Fetching Content : ",`/api/v1/pages/${page?.data?.bookUUID}/${page?.data?.pageNumber}`)

            const params = new URLSearchParams()
            if(author?.data?.authorId?.email)
                params.append("author",author?.data?.authorId?.email)
            if(language?.data)
                params.append("language",language?.data)

            const query = params.toString()?`?${params.toString()}`:''
            
            const data = await fetch(`/api/v1/pages/${page?.data?.bookUUID}/${page?.data?.pageNumber}${query}`)
            if(data.ok){
                const requested_page = await data.json()
                content.set(requested_page)
                console.log("Fetched Data : ", requested_page)
            }
        }
        if(page?.data?.bookUUID)
        getPageVersion()
    },[page?.data,author?.data,language?.data])
    return (
        <div className="h-screen overflow-y-auto w-full flex justify-center">
            <div className=" bg-gray-50 p-10 rounded-2xl max-w-4xl min-w-full text-justify lg:min-w-4xl flex flex-col min-h-full relative">
                <div className="mb-4 text-right text-sm text-gray-400">{book?.data?.title}</div>
                <div className="grow w-full">{content?.data?.content}</div>
                <div className="text-center text-gray-600 ">{(page?.data?.pageNumber!==undefined?page?.data?.pageNumber+1:0).toString().padStart(2,"0")}</div>
            </div>
        </div>
    )
}

export default ReadPage