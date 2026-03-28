import connection from "@/lib/database"
import User from "@/modules/user/models/user.model"


export async function GET(req:Request){
    const {sort, lang, page} = Object.fromEntries(new URL(req.url).searchParams)
    if(sort || lang || page){
        const filter:{[key: string]: string} = {}
        if(lang){
            filter["languages.name"] = lang
        }
        const users = await User.find(filter,'_id name email isBlocked').sort(sort === "asc" ? {name:1} : sort === "desc" ? {name:-1} : {}).skip(page ? (Number(page)-1)*10 : 0).limit(10)
        return Response.json({message:"Query parameters received", sort, lang, page, users},{status:200})
    }
    await connection()
    const users = await User.find({}, '_id name email isBlocked').limit(10)
    return Response.json({message:"Users GET endpoint", users},{status:200})
}