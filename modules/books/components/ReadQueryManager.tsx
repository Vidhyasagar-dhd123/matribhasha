import { useEffect } from "react"
import { useReader } from "../contexts/read.context"


const ReadQueryManager = () =>{
    const {authors,content,page, author,language} = useReader()
    useEffect(()=>{
        const getAuthors = async ()=>{
            const data = await fetch(`/api/v1/pages/${page?.data?.bookUUID}/${page?.data?.pageNumber}/authors`)
            if(data.ok)
            {
                const req_author = await data.json()
                authors?.set(req_author)
                console.log(req_author)
            }
        }
        if(page?.data?.bookUUID && page?.data?.pageNumber!==undefined && !authors?.data?.length)
        getAuthors()
        console.log(language?.data)
    },[page?.data])
    return (
        <div className="w-60 z-10 right-0 top-0  h-full min-h-screen bg-blue-100 border-r border-r-blue-300 lg:relative">
            {/*absolute bg-blue-100 right-0 top-0 h-full w-60 lg:relative border-l border-l-blue-300*/}
            <div className="z-50 ">
                <div className="p-4">Author</div>
                    <div className="">
                        {   authors &&
                            authors?.data?.map((value,key)=>{
                                return(
                                <div className="border-b p-4 border-b-blue-300 bg-blue-200" onClick={()=>{author?.set(value);language?.set(value?.language)}} key={key}>
                                    <div className="text-blue-700">{value?.authorId?.name}</div>
                                    <div className="text-blue-600 text-sm inline">{value?.authorId?.email}</div>
                                    <span className="p-2 text-red-700">{value?.language}</span>
                                </div>)
                            })
                        }
                    </div>
            </div>
        </div>
    )
}

export default ReadQueryManager