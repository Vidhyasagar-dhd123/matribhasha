import jwt from "jsonwebtoken"

export function signJWT(payload) {
    const jwtSecret = process.env.JWT_SECRET
    if (!jwtSecret) {
        throw new Error("JWT_SECRET is not defined in environment variables")
    }

    return jwt.sign(payload, jwtSecret, { expiresIn: "7d" })
}

export function verifyJWT(token) {
    const jwtSecret = process.env.JWT_SECRET
    if (!jwtSecret) {
        throw new Error("JWT_SECRET is not defined in environment variables")
    }

    try {
        return jwt.verify(token, jwtSecret)
    } catch {
        return null
    }
}

async function authenticateUser(req)
{
    const bearerToken = req.headers.get("authorization")
    if(!bearerToken || !bearerToken.startsWith('Bearer '))
        return null
    
    const token = bearerToken.split(' ')[1].trim()
    return verifyJWT(token)
}

export function isAdminUser(user) {
    return user?.role === "admin"
}

export function canAccessUser(user, targetUserId) {
    if (!user) {
        return false
    }

    return isAdminUser(user) || String(user.id) === String(targetUserId) || String(user._id) === String(targetUserId)
}

export default authenticateUser