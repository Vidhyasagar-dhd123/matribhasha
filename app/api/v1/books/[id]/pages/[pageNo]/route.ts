import connection from "@/lib/database";
import Book from "@/modules/books/models/Book.model";
import Page from "@/modules/books/models/Pages.model";


export async function GET(req:Request,{params}:{params:Promise<{id:string, pageNo:number}>}){
    try
    {
        await connection()
        const {id,pageNo} = await params
        console.log(id)
        const book = await Book.findOne({uuid:id})
        if(!id && !pageNo)
        {   
            console.log("ID validation Failed for Page Request")
            return Response.json({message:"Invalid Request"})
        }
        if(!book)
        {
            console.log("Book Not Found")
            return Response.json({message:"Book Not Found"},{status:404})
        }
        const next_pages = await Page.find({bookId:book._id,pageNumber:{$gte:pageNo}}).sort({pageNumber:1}).limit(5)
        const prev_pages = await Page.find({bookId:book._id,pageNumber:{$lt:pageNo}}).sort({pageNumber:-1}).limit(5)

        const paginated_pages = [...prev_pages.reverse(),...next_pages]

        if(!paginated_pages){
            return Response.json({message:"No Pages Found"},{status:404})
        }
        return Response.json(paginated_pages,{status:200})
    }
    catch(err)
    {
        console.log(err)
        return Response.json({message:"Something Went Wrong"},{status:500})
    }
}