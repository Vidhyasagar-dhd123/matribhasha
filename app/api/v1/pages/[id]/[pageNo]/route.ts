import connection from "@/lib/database"
import Page from "@/modules/books/models/Pages.model"
import PageVersion from "@/modules/books/models/PageVersion.model"
import User from "@/modules/user/models/user.model"


export async function GET(req:Request,{params}:{params:Promise<{pageNo:number|undefined|null,id:string}>}){
    try
    {   
        await connection()
        const {searchParams} = new URL(req.url)

        const author = searchParams.get("author")
        const language = searchParams.get("language")

        const {id,pageNo} = await params

        if (!pageNo || isNaN(Number(pageNo)) || !id) 
        {
            console.log("Invalid Request:", id);
            return Response.json({ message: "Invalid Request" }, { status: 400 });
        }

        const page = await Page.findOne({pageNumber:pageNo,bookUUID:id})

        if(!page)
        {
            console.log("Page not Found")
            return Response.json({message:"Page Not Found"},{status:404})
        }

        let userId;

        if(author)
        {
            const user = await User.findOne({email:author})
            if(!user)
            {
                return Response.json({message:"Author Not Found"},{status:404})
            }
            userId = user._id
        }

        const query : Record<string,unknown> = {pageId:page._id}

        if(userId) query.authorId = userId;

        query.language = language||page.originalLanguage;

        const versioned_page = await PageVersion.findOne(query).populate({path:"authorId",select:"name email -_id"})
        
        if(!versioned_page){
            console.log("Version Not Found")
            return Response.json({message:"No Translation For This Page"},{status:404})
        }
        return Response.json(versioned_page,{status:200})
    }
    catch(err)
    {
        console.log(err)
        return Response.json({message:"Something Went Wrong"},{status:500})
    }
}