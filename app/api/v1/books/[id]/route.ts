import Book from "@/modules/books/models/Book.model";
import connection from "@/lib/database";

export async function GET(req,{params}:{params:Promise<{id:string}>}){
    try
    {
        const {id} = await params
        await connection()
        const RequestedBook = await Book.findOne({uuid:id})
        return Response.json(RequestedBook,{status:200})
    }
    catch(err)
    {
        console.log(err)
        return Response.json({"message":"Error Occured"},{status:400})
    }
}