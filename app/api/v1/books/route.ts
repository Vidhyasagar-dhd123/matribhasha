import Book from "@/modules/books/models/Book.model";
import connection from "@/lib/database";
export async function GET(req:Request){
    try{
        await connection()
        const Books = await Book.find()
        return Response.json(Books,{status:200})
    }
    catch(err)
    {   
        console.log(err)
        return Response.json({message:"error"},{status:400})
    }
}

export async function POST(req:Request){
    try{
        const body = await req.json()
        await connection()
        const newBook = new Book(body)
        await newBook.save()
        return Response.json(newBook,{status:201})
    }
    catch(err)
    {
        console.log(err)
        return Response.json({message:"error"},{status:400})
    }
}