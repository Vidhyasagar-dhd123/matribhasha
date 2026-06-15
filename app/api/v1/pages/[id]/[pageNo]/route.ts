import connection from "@/lib/database"
import Page from "@/modules/books/models/Pages.model"
import PageVersion from "@/modules/books/models/PageVersion.model"
import User from "@/modules/user/models/user.model"
import authenticateUser from "@/lib/auth"


export async function GET(req:Request,{params}:{params:Promise<{pageNo:string|undefined|null,id:string}>}){
    try
    {   
        await connection()
        const {searchParams} = new URL(req.url)

        const author = searchParams.get("author")
        const language = searchParams.get("language")

        const {id,pageNo} = await params
        const pageNumber = Number(pageNo)

        if (!pageNo || isNaN(Number(pageNo)) || !id) 
        {
            console.log("Invalid Request:", id);
            return Response.json({ message: "Invalid Request" }, { status: 400 });
        }

        const page = await Page.findOne({pageNumber,bookUUID:id})

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

export async function PUT(req: Request, { params }: { params: Promise<{ pageNo: string | undefined | null; id: string }> }) {
    try {
        await connection()
        const currentUser = await authenticateUser(req)
        if (!currentUser) {
            return Response.json({ message: "Unauthorized" }, { status: 401 })
        }

        const { id, pageNo } = await params
        const pageNumber = Number(pageNo)
        if (!id || !Number.isFinite(pageNumber)) {
            return Response.json({ message: "Invalid Request" }, { status: 400 })
        }

        const body = await req.json()
        const language = String(body.language || body.originalLanguage || "").trim()
        const content = String(body.content || "").trim()

        if (!language || !content) {
            return Response.json({ message: "Language and content are required" }, { status: 400 })
        }

        const page = await Page.findOne({ pageNumber, bookUUID: id })
        if (!page) {
            return Response.json({ message: "Page Not Found" }, { status: 404 })
        }

        const authorId = String(currentUser.id || currentUser._id || "")
        const updatedPage = await PageVersion.findOneAndUpdate(
            { pageId: page._id, language, authorId },
            { $set: { content, language, authorId, pageId: page._id } },
            { new: true, upsert: true }
        ).populate({ path: "authorId pageId", select: "name email -_id pageNumber bookUUID -_id" })

        return Response.json(updatedPage, { status: 200 })
    } catch (error) {
        console.error("Error updating page version:", error)
        return Response.json({ message: "Internal Server Error" }, { status: 500 })
    }
}