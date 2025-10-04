import { useEffect } from "react"
import { useReader } from "../contexts/read.context"
import {CircleUser} from 'lucide-react'

const ReadQueryManager = () =>{
    const {authors,content,page, author,language} = useReader()
    useEffect(()=>{
        const getAuthors = async ()=>{
            console.log("Requesting Authors...")
            const data = await fetch(`/api/v1/pages/${page?.data?.bookUUID}/${page?.data?.pageNumber}/authors`)
            if(data.ok)
            {
                const req_author = await data.json()
                authors?.set(req_author)
                console.log("Authors Fetched",req_author)
            }
        }
        if(page?.data?.bookUUID && page?.data?.pageNumber!==undefined)
        getAuthors()
        console.log(language?.data)
    },[page?.data])
    return (
        <div className="w-60 z-10 right-0 top-0  h-full min-h-screen bg-[var(--secondary)] border-r  lg:relative">
            {/*absolute bg-blue-100 right-0 top-0 h-full w-60 lg:relative border-l border-l-blue-300*/}
            <div className="z-50 ">
                <div className="p-4">Author</div>
                    <div className="">
                        {   authors &&
                            authors?.data?.map((value,key)=>{
                                return(
                                <div className="border-b p-4 bg-[var(--accent)]" onClick={()=>{author?.set(value);language?.set(value?.language)}} key={key}>
                                    <div className="text-blue-700 flex dark:text-blue-400">{value?.authorId?.name}</div>
                                    <div className="text-blue-600 text-sm inline dark:text-blue-500">{value?.authorId?.email}</div>
                                    <span className="p-2 text-red-700 dark:text-red-500">{value?.language}</span>
                                </div>)
                            })
                        }
                    </div>
            </div>
        </div>
    )
}

export default ReadQueryManager