import { BASE_URL } from "@/modules/shared/utils/config"

export const getBooks= async(filter:object)=>{
    console.log(`Books Requested ${filter}`)
    const res = await fetch(`${BASE_URL}api/v1/books`,{
        method:'POST',
        body:JSON.stringify(filter)}
    )
}

export const getBook=(id:string)=>{
    console.log(`Book requested for id: ${id}`)
}

export const createBook= async (data:object)=>{
    console.log(`Book create request for data ${data}`,data)
    const res = await fetch(`${BASE_URL}api/v1/books`,{
        method:'POST',
        body:JSON.stringify(data)}
    ).then(data=>console.log(data))
    console.log(res)
}

export const updateBook=async (id:string, data:object)=>{
    console.log(`Book update request for book: ${id}`, data)
    const res = await fetch(`${BASE_URL}api/v1/books/${id}`,{
        method:'PUT',
        body:JSON.stringify(data)}
    ).then(data=>console.log(data))
    console.log(res)
}

export const deleteBook=async (id:string)=>{
    console.log(`Book delete request for id: ${id}`)
    const res = await fetch(`${BASE_URL}api/v1/books/${id}`,{
        method:'DELETE'}
    ).then(data=>console.log(data))
    console.log(res)
}