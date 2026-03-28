import { useEffect, useState } from "react"
import { useReader } from "../contexts/read.context"


const ReadPage = () =>{
    const {content,page, book,author,language} = useReader()
    const [loading, setLoading] = useState(true)
    useEffect(()=>{
        const getPageVersion=async()=>{
            console.log("Fetching Content : ",`/api/v1/pages/${page?.data?.bookUUID}/${page?.data?.pageNumber}`)

            const params = new URLSearchParams()
            if(author?.data?.authorId?.email)
                params.append("author",author?.data?.authorId?.email)
            if(language?.data)
                params.append("language",language?.data)

            const query = params.toString()?`?${params.toString()}`:''
            setLoading(true)
            const data = await fetch(`/api/v1/pages/${page?.data?.bookUUID}/${page?.data?.pageNumber}${query}`)
            if(data.ok){
                setLoading(false)
                const requested_page = await data.json()
                content.set(requested_page)
                console.log("Fetched Data : ", requested_page)
            }
        }
        if(page?.data?.bookUUID)
        getPageVersion()
    },[page?.data,author?.data,language?.data])
    return (
        <div className="h-screen overflow-y-auto w-full flex justify-center p-2">
            {!loading && <div className="min-h-max p-8 max-w-4xl min-w-full  lg:min-w-4xl flex flex-col relative text-justify leading-relaxed bg-background border border-border/50 rounded-md">
                <div className="mb-4 text-end text-secondary text-sm">{book?.data?.title}</div>
                <div className="grow w-full first-letter:text-2xl">{content?.data?.content}</div>
                <div className="text-center text-secondary-foreground">{(page?.data?.pageNumber!==undefined?page?.data?.pageNumber+1:0).toString().padStart(2,"0")}</div>
            </div>}
            {loading && <div className="flex items-center justify-center text-2xl text-secondary-foreground">Loading...</div>}
        </div>
    )
}

export default ReadPage