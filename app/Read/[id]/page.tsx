"use client"

import ReadContainer from "@/modules/books/components/ReadContainer"
import { ReadProvider } from "@/modules/books/contexts/read.context"
import React, { useEffect, useState } from "react"

const Page = ({ params }: { params: Promise<{ id: string }> }) =>{
    const {id} = React.use(params)
    return(
        <ReadProvider id={id}>
            <ReadContainer></ReadContainer>
        </ReadProvider>
    )
}

export default Page