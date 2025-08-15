import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET
const JWT_EXPIRES_IN = '7d'

export function signJWT(payload:object){
    try
    {
        if(!JWT_SECRET){
            throw new Error("JWT_SECRET is not defined in environment variables")}
        return jwt.sign(payload,JWT_SECRET,{expiresIn:JWT_EXPIRES_IN});
    }
    catch
    {
        return null
    }
}

export function verifyJWT<T>(token:string):T|null{
    try
    {
        if(!JWT_SECRET){
            throw new Error("JWT_SECRET is not defined in environment variables")}
        return jwt.verify(token,JWT_SECRET) as T;
    }
    catch
    {
        return null
    }
}