import Book from "@/modules/books/models/Book.model";
import connection from "@/lib/database";
export async function GET(req){
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