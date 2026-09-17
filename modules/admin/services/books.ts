import { BASE_URL } from "@/modules/shared/utils/config"
import { getRequestHeaders } from "@/modules/shared/utils/request"

export const getBooks = async (filter: { search?: string; page?: number; limit?: number; sort?: string } = {}) => {
    const params = new URLSearchParams()

    if (filter.search) params.set("search", filter.search)
    if (filter.page) params.set("page", String(filter.page))
    if (filter.limit) params.set("limit", String(filter.limit))
    if (filter.sort) params.set("sort", filter.sort)

    const url = `${BASE_URL}api/v1/books${params.toString() ? `?${params.toString()}` : ""}`
    const res = await fetch(url, {
        method: 'GET',
        headers: getRequestHeaders(false)
    })

    return res.json()
}

export const getBook=(id:string)=>{
    console.log(`Book requested for id: ${id}`)
}

export const createBook= async (data:object)=>{
    console.log(`Book create request for data ${data}`,data)
    const res = await fetch(`${BASE_URL}api/v1/books`,{
        method:'POST',
        headers: getRequestHeaders(),
        body:JSON.stringify(data)}
    )
    return res.json()
}

export const updateBook=async (id:string, data:object)=>{
    console.log(`Book update request for book: ${id}`, data)
    const res = await fetch(`${BASE_URL}api/v1/books/${id}`,{
        method:'PUT',
        headers: getRequestHeaders(),
        body:JSON.stringify(data)}
    )
    return res.json()
}

export const deleteBook=async (id:string)=>{
    console.log(`Book delete request for id: ${id}`)
    const res = await fetch(`${BASE_URL}api/v1/books/${id}`,{
        method:'DELETE',
        headers: getRequestHeaders(false)}
    )
    return res.json()
}