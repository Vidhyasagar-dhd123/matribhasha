import User from "../models/user.model";
import connection from '@/lib/database'

await connection()

interface userType{
    username:string,
    email:string,
    password:string
}

export async function createUser(userData:userType){
    const {username,email,password} = userData;
    const user = new User({name:username,email,password})
    const response = await user.save()
    return response
}