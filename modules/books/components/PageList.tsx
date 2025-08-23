"use client"

import { useReader } from "../contexts/read.context"

const PageList = () =>{
    const {page,pages} = useReader()

    return (
        <aside className="">
                <div className="max-w-6xl overflow-x-auto m-4 bg-blue-500 rounded-[1.2rem] min-w-[100px] flex items-center overflow-y-auto">
                    {
                        pages?.data &&
                        pages?.data.map((page_i,key)=>{
                            return <div onClick={()=>page.set(page_i)} className="cursor-pointer unit w-full shadow rounded shadow-blue-900 hover:bg-green-400 bg-blue-400 m-1 p-2 px-4 text-center text-white" key={key}>{page?.data?.pageNumber}</div>
                        })
                    }
                </div>
        </aside>
    )
}

export default PageList