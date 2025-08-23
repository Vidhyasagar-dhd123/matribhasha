import connection from "@/lib/database";
import Page from "@/modules/books/models/Pages.model";
import PageVersion from "@/modules/books/models/PageVersion.model";


export async function GET(req:Request,{params}:{params:Promise<{id:string,pageNo:number}>}){
    try
    {
        await connection()
        const {id,pageNo} = await params
        const page = await Page.findOne({bookUUID:id,pageNumber:pageNo})
        if(!page)
        {
            console.log("Page Not Found")
            return Response.json({message:"Page Not Found"},{status:404})
        }
        const authorsData = await PageVersion.find({pageId:page._id},"authorId language").populate({path:"authorId", select:"name email -_id"})

        console.log(authorsData)
        return Response.json(authorsData,{status:200})
    }
    catch(err)
    {
        console.log(err)
        return Response.json({message:"Something Went Wrong"},{status:500})
    }
}