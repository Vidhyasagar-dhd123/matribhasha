import connection from "@/lib/database";
import User from "@/modules/user/models/user.model";


export async function GET(req:Request,{params}:{params:Promise<{id:string}>}){
    try{
        //find user by id
        await connection()
        const {id} = await params;
        console.log(`Requesting for ID: ${id}`)
        const user = await User.findById(id)
        //if user not found return not found message
        if(!user)
            return Response.json({message:"User Not Found"},{status:401})
        console.log("Found User:",user)
        //return the user to client
        return Response.json(user,{status:200})
    }
    catch(err)
    {
        console.log(`Error Fetching User: ${err}`)
    }
}

export async function PATCH(req:Request,{params}:{params:Promise<{id:string}>})
{
    try
    {
        await connection()
        const {id} = await params;

        const body = await req.json();
        console.log(`Update Request for ID: ${id}`)
        console.log("Request Body:",body)

        //prevent password updates through this route
        const filteredBody = Object.fromEntries(Object.entries(body).filter(([key])=>key!=="password"))

        if (Object.keys(filteredBody).length===0)
            return Response.json({message:"No valid fields to update"},{status:400})

        const user = await User.findOneAndUpdate({_id:id},{$set:filteredBody},{new:true})

        if(!user)
            return Response.json({message:"User Not Found"},{status:404})

        console.log("Updated User:",user)
        return Response.json({message:"User Updated Successfully",user},{status:200})
    }
    catch(err)
    {
        console.log(`Error Updating User: ${err}`)
    }
}

export async function DELETE(req:Request,{params}:{params:Promise<{id:string}>})
{
    try
    {
        await connection()
        const {id} = await params;
        console.log(`Delete Request for ID: ${id}`)
        const user = await User.findByIdAndDelete(id)
        if(!user)
            return Response.json({message:`User Not Found ${id}`})
        console.log(`User Deleted successfully ${user}`)
        return Response.json(user,{status:200})
    }
    catch(err)
    {
        console.log('Error Deleting User: ',err)
    }
}