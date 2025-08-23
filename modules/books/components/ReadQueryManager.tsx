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
        if(page?.data?.bookUUID)
        getAuthors()
        console.log(language?.data)
    },[page?.data])
    return (
        <div className=" bg-blue-100">
            <div className="">
                <div className="p-4">Author</div>
                <div>
                    <div className="bg-blue-300 p-4">
                        {   authors &&
                            authors?.data?.map((value,key)=>{
                                return(
                                <div onClick={()=>{author?.set(value);language?.set(value?.language)}} key={key}>
                                    <div className="text-blue-700">{value?.authorId?.name}</div>
                                    <div className="text-blue-600 text-sm">{value?.authorId?.email}</div>
                                    <span>{value?.language}</span>
                                </div>)
                            })
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ReadQueryManager