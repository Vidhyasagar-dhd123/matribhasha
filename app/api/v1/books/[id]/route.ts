import Book from "@/modules/books/models/Book.model";
import connection from "@/lib/database";
import Page from "@/modules/books/models/Pages.model";
import PageVersion from "@/modules/books/models/PageVersion.model";
import authenticateUser, { isAdminUser } from "@/lib/auth";

export async function GET(req:Request,{params}:{params:Promise<{id:string}>}){
    try
    {
        const {id} = await params
        await connection()
        const RequestedBook = await Book.findOne({uuid:id})
        if (!RequestedBook) {
            return Response.json({message:"Book Not Found"},{status:404})
        }

        const pages = await Page.find({bookUUID:id}).select("_id")
        const pageIds = pages.map((page) => page._id)
        const [versionCount, languages, contributors] = await Promise.all([
            PageVersion.countDocuments({pageId:{$in:pageIds}}),
            PageVersion.distinct("language",{pageId:{$in:pageIds}}),
            PageVersion.distinct("authorId",{pageId:{$in:pageIds}}),
        ])

        const book = RequestedBook.toObject()
        return Response.json({
            ...book,
            pages: book.pages?.length ? book.pages : pageIds,
            versions: Array.from({length: versionCount}, (_, index) => String(index + 1)),
            versionCount,
            contributors: contributors.filter(Boolean).length,
            translatedLanguages: languages.filter(Boolean),
        },{status:200})
    }
    catch(err)
    {
        console.log(err)
        return Response.json({"message":"Error Occured"},{status:400})
    }
}

export async function DELETE(req:Request,{params}:{params:Promise<{id:string}>}){
    try
    {
        const currentUser = await authenticateUser(req)
        if (!isAdminUser(currentUser)) {
            return Response.json({ message: "Unauthorized" }, { status: 401 })
        }

        const {id} = await params
        await connection()
        const book = await Book.findOneAndDelete({uuid:id})
        if(!book){
            return Response.json({"message":"Book Not Found"},{status:404})
        }
        const pages = await Page.find({bookId:book._id})
        const pageIds = pages.map(page=>page._id)
        await Page.deleteMany({bookId:book._id})
        await PageVersion.deleteMany({pageId:{$in:pageIds}})
        return Response.json({"message":"Book Deleted Successfully"},{status:200})
    }
    catch(err)
    {
        console.log(err)
        return Response.json({"message":"Error Occured"},{status:400})
    }
}

export async function PUT(req:Request,{params}:{params:Promise<{id:string}>}){
    try
    {
        const currentUser = await authenticateUser(req)
        if (!isAdminUser(currentUser)) {
            return Response.json({ message: "Unauthorized" }, { status: 401 })
        }

        const {id} = await params
        const body = await req.json()
        await connection()
        const updatedBook = await Book.findOneAndUpdate({uuid:id},body,{new:true})
        return Response.json(updatedBook,{status:200})
    }
    catch(err)
    {
        console.log(err)
        return Response.json({"message":"Error Occured"},{status:400})
    }
}
