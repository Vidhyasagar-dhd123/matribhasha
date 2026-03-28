import { translate } from "@/app/api/translation/services/translate.service"
import connection from "@/lib/database"
import map from "@/lib/langMaps"
import Book from "@/modules/books/models/Book.model"
import Page from "@/modules/books/models/Pages.model"
import PageVersion from "@/modules/books/models/PageVersion.model"
import User from "@/modules/user/models/user.model"

export async function GET(req:Request,{params}:{params:Promise<{id:string}>}){
    try
    {   
        await connection()
        const {searchParams} = new URL(req.url)
        const language = searchParams.get("language")
        const {id} = await params
        if (!id) 
        {
            console.log("Invalid Request:", id);
            return Response.json({ message: "Invalid Request" }, { status: 400 });
        }
        const page = await Page.findOne({_id:id})
        if(!page)
        {
            console.log("Page not Found")
            return Response.json({message:"Page Not Found"},{status:404})
        }
        console.log("Page Found:", page);
        const query : Record<string,unknown> = {pageId:page._id}
        query.language = language||page.originalLanguage;
        const versioned_page = await PageVersion.findOne(query).populate({path:"authorId pageId",select:"name email -_id pageNumber bookUUID -_id"})
        if(!versioned_page){
            console.log("Version Not Found")
            return Response.json({message:"No Translation For This Page"},{status:404})
        }
        return Response.json(versioned_page,{status:200})
    }
    catch(err)
    {
        console.log(err)
        return Response.json({"message":"Error Occured"},{status:400})
    }
}
