import User from "../models/user.model";
import connection from '@/lib/database'

interface userType{
    username:string,
    email:string,
    password:string
}

export async function createUser(userData:userType){
    const {username,email,password} = userData;
    await connection()
    const user = new User({name:username,email,password})
    const response = await user.save()
    return response
}