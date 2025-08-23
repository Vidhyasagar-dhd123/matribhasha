"use client"

import ChapterList from "@/modules/books/components/ChapterList"
import PageList from "@/modules/books/components/PageList"
import ReadPage from "@/modules/books/components/ReadPage"
import React, { useEffect, useState } from "react"
import ReadQueryManager from "./ReadQueryManager"

const ReadContainer = () =>{
    return(
        <section className="flex flex-col items-center justify-center bg-gray-200 w-full">
            <div className="flex flex-row justify-between w-full">
                <ChapterList></ChapterList>
                <ReadPage></ReadPage>
                <ReadQueryManager></ReadQueryManager>
            </div>
                <PageList></PageList>
        </section>
    )
}

export default ReadContainer