import { useEffect } from "react"
import { useReader } from "../contexts/read.context"
const ReadQueryManager = () =>{
    const {authors,page, author,language} = useReader()
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
        <div className="w-60 z-10 right-0 top-0  h-full bg-background border border-border/50 lg:relative">
            {/*absolute  right-0 top-0 h-full w-60 lg:relative  */}
            <div className="z-50 ">
                <div className="p-4">Author</div>
                    <div className="">
                        {   authors &&
                            authors?.data?.map((value,key)=>{
                                return(
                                <div className=" p-4 cursor-pointer hover:bg-muted/20 bg-muted/10 border-b border-border/50" onClick={()=>{author?.set(value);language?.set(value?.language)}} key={key}>
                                    <div className="text-primary flex text-sm">{value?.authorId?.name}</div>
                                    <div className="text-accent inline text-sm">{value?.authorId?.email}</div>
                                    <div className="m-2 p-1 text-[rgb(250,50,50)] text-end inline bg-[rgb(250,50,50)]/10">{value?.language?.toLowerCase()}</div>
                                </div>)
                            })
                        }
                    </div>
            </div>
        </div>
    )
}

export default ReadQueryManager