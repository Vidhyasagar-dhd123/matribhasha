import React, { useContext, createContext, useState, useEffect, ReactNode } from "react";


const ReadContext = createContext(null)

export const ReadProvider = ({id,children}:{id:string,children:ReactNode}) =>{
    const [language,setLanguage] = useState<string>("en")
    const [authors,setAuthors] = useState([])
    const [author,setAuthor] = useState<string|null>(null)
    const [page, setPage] = useState<object>({})
    const [pages,setPages] = useState([])
    const [chapter,setChapter] = useState<object>({})
    const [chapters,setChapters] = useState([])
    const [contentPage, setContentPage] = useState<object>({})
    const [book,setBook] = useState<object>({})

    useEffect(()=>{
        const loadBook = async()=>{
            const data = await fetch(`/api/v1/books/${id}`)
            if(data.ok)
            {
                const res_book = await data.json()
                console.log(res_book)
                setBook(res_book)
            }
        }
        loadBook()
    },[id])

    useEffect(()=>{
        if(book?.uuid)
            loadPages()
    },[book])

    const loadPages = async()=>
    {
        const data = await fetch(`/api/v1/books/${book?.uuid}/pages/${page?.pageNumber||0}`)
        if(data.ok)
        {
            const requested_pages = await data.json()
            setPages(requested_pages)
            if(requested_pages)
                setPage(requested_pages[0])
            console.log("requested pages",requested_pages)
        }
        else {
            console.log(await data.json())
        }
    }

    const value =
    {   
        book:{data:book , set:setBook },
        authors:{data: authors, set: setAuthors},
        author:{data: author, set: setAuthor},
        page:{data: page, set: setPage},
        pages:{data: pages, set: setPages},
        chapter:{data: chapter, set: setChapter},
        chapters:{data: chapters, set: setChapters},
        language:{data: language, set: setLanguage},
        content:{data:contentPage, set:setContentPage}
    }
    return (
        <ReadContext.Provider value={value}>{children}</ReadContext.Provider>
    )
}

export const useReader=()=>{
    const context = useContext(ReadContext)
    if(!context)
    {
        throw new Error("useReader must be used inside ReadProvider")
    }
    return context
}