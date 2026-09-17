"use client"
import { useRouter } from "next/navigation"
import { useAuth } from "@/modules/auth/contexts/authContext"
import { useEffect } from "react"
const Profile = () =>{
    const {user, loading} = useAuth()
    const router = useRouter()
    useEffect(()=>{
        if (loading) {
            return
        }
        if(user){
            router.push("/profile/" + (user?.username || ""))
        }
        else
            router.push("/login")
    },[loading, router, user])
    return (<>
        </>)
}

export default Profile