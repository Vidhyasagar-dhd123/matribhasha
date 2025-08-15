import connection from "@/lib/database";
import { signJWT } from "@/modules/auth/utils/jwt";
import { comparePassword } from "@/modules/auth/utils/password";
import User from "@/modules/user/models/user.model";
import { NextRequest } from "next/server";


export async function POST(req:NextRequest) {
  try{
    await connection()
    const {email,password} = await req.json();
    console.log(email,password)
    if(!email||!password)
      return new Response(JSON.stringify({Message:"Invalid Request"}),{status:400})
    
    const userExists = await User.findOne({email})

    if(!userExists){
      return new Response(JSON.stringify({message:"No such user exists."}),{status:404})
    }

    const isMatch = await comparePassword(password,userExists.password)

    if(!isMatch)
      return new Response(JSON.stringify({message:"Wrong Password"}),{status:400})

    const token = signJWT({id:userExists._id, username:userExists.name})
    return new Response(JSON.stringify({ user:{id:userExists._id,username:userExists.name,email:userExists.email},token }), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  }
  catch(err)
  {
    console.log(err)
  }
}