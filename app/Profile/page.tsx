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
            router.push("/Profile/"+user?.username)
        }
        else
            router.push("/Login")
    },[loading, router, user])
    return (<>
        </>)
}

export default Profile