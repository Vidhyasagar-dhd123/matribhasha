"use client"
import { useRouter } from "next/navigation"
import { useAuth } from "@/modules/auth/contexts/authContext"
import { useEffect } from "react"
const Profile = () =>{
    const {user} = useAuth()
    const router = useRouter()
    useEffect(()=>{
        if(user){
            router.push("/Profile/"+user?.username)
        }
        else
            router.push("/Login")
    },[])
    return (<>
        </>)
}

export default Profile