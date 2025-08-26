import connection from "@/lib/database";


export async function GET(req:Request,{params}:{params:Promise<{id:string,pageNo:string}>}){
    try
    {
        await connection()
        const {id,pageNo} = await params;
        return Response.json({message:JSON.parse(`{"id" : "${id}", "pageNo":${pageNo}}`)},{status:200})

    }
    catch(err)
    {
        console.log("Error Occurred at :\n page/[id]/[pageNo]/languages/route : (500)\n",err)
        return Response.json({message:"Something Went Wrong : (500) [Internal Server Error]"},{status:500})
    }
}