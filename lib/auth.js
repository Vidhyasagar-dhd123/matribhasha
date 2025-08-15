import jwt from "jsonwebtoken"

async function authenticateUser(req)
{
    const bearerToken = req.headers.get("authorization")
    if(!bearerToken || !bearerToken.startsWith('Bearer '))
        return Response.json({error:"Authorization failed"},{status:400})
    
    const token = bearerToken.split(' ')[1].trim()
    try{
        const decoded = jwt.verify(token,process.env.JWT_SECRET)
        return {user:decoded}
    }
    catch(error)
    {
        return {error,message:"Verification Failed"}
    }
}

export default authenticateUser