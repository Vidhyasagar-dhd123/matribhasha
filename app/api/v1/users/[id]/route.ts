import connection from "@/lib/database";
import User from "@/modules/user/models/user.model";
import authenticateUser, { canAccessUser, isAdminUser } from "@/lib/auth";


export async function GET(req:Request,{params}:{params:Promise<{id:string}>}){
    try{
        //find user by id
        await connection()
        const {id} = await params;
        const currentUser = await authenticateUser(req)

        if (!canAccessUser(currentUser, id)) {
            return Response.json({ message: "Unauthorized" }, { status: 401 })
        }

        const user = await User.findById(id).select("_id name email isBlocked role languages bio createdAt updatedAt")
        //if user not found return not found message
        if(!user)
            return Response.json({message:"User Not Found"},{status:404})
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
        const currentUser = await authenticateUser(req)

        if (!canAccessUser(currentUser, id)) {
            return Response.json({ message: "Unauthorized" }, { status: 401 })
        }

        const body = await req.json();

        //prevent password updates through this route
        const filteredBody = Object.fromEntries(Object.entries(body).filter(([key])=>key!=="password" && key!=="_id"))

        if (!isAdminUser(currentUser)) {
            delete filteredBody.role
            delete filteredBody.isBlocked
        }

        if (Object.keys(filteredBody).length===0)
            return Response.json({message:"No valid fields to update"},{status:400})

        const user = await User.findOneAndUpdate({_id:id},{$set:filteredBody},{new:true}).select("_id name email isBlocked role languages bio createdAt updatedAt")

        if(!user)
            return Response.json({message:"User Not Found"},{status:404})

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
        const currentUser = await authenticateUser(req)

        if (!canAccessUser(currentUser, id)) {
            return Response.json({ message: "Unauthorized" }, { status: 401 })
        }

        const user = await User.findByIdAndDelete(id)
        if(!user)
            return Response.json({message:`User Not Found ${id}`},{status:404})
        return Response.json({
            message:"User Deleted Successfully",
            user:{_id:user._id,name:user.name,email:user.email,role:user.role}
        },{status:200})
    }
    catch(err)
    {
        console.log('Error Deleting User: ',err)
        return Response.json({ message: "Internal Server Error" }, { status: 500 })
    }
}