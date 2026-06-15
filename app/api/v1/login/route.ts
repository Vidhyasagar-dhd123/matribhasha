import connection from "@/lib/database";
import { signJWT } from "@/modules/auth/utils/jwt";
import { comparePassword } from "@/modules/auth/utils/password";
import User from "@/modules/user/models/user.model";
import { NextRequest } from "next/server";


export async function POST(req:NextRequest) {
  try{
    await connection()
    const {email,password} = await req.json();
    if(!email||!password)
      return new Response(JSON.stringify({Message:"Invalid Request"}),{status:400})
    
    const userExists = await User.findOne({email})

    if(!userExists){
      return new Response(JSON.stringify({message:"No such user exists."}),{status:404})
    }

    const isMatch = await comparePassword(password,userExists.password)

    if(!isMatch)
      return new Response(JSON.stringify({message:"Wrong Password"}),{status:400})

    if (userExists.isBlocked) {
      return new Response(JSON.stringify({message:"Account is blocked"}),{status:403})
    }

    const role = userExists.role || "user"
    const userId = String(userExists._id)
    const token = signJWT({id:userId, username:userExists.name, role})
    return new Response(JSON.stringify({ user:{id:userId,username:userExists.name,email:userExists.email,role},token }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }
  catch(err)
  {
    console.log(err)
    return new Response(JSON.stringify({Message:"Internal Server Error"}),{status:500})
  }
}