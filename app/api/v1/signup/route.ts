import { signJWT } from "@/modules/auth/utils/jwt";
import { hashPassword } from "@/modules/auth/utils/password";
import User from "@/modules/user/models/user.model";
import { createUser } from "@/modules/user/service/user.services";
import { NextRequest } from "next/server";


export async function POST(req:NextRequest){
    try
    {
        const {email,username,password} = await req.json()
        if(!email||!username||!password){
            return new Response(JSON.stringify({message:"Some values are missing."}),{status:400})
        }

        const userExists = await User.findOne({email})
        if(userExists){
            return new Response(JSON.stringify({message:"User already exists."}),{status:409})
        }

        const hashedPass = await hashPassword(password)

        const user = await createUser({username,email,password:hashedPass})

        const token = signJWT({id:user._id, username:user.name})

        return new Response(JSON.stringify({user:{id:user._id,username:user.name},token}),
        {status:201,headers:{'Content-Type':'application/json'}})
    }
    catch(err)
    {
        console.log(err);
        return new Response(JSON.stringify({message:"Internal Server Error"}),{status:500})
    }
}