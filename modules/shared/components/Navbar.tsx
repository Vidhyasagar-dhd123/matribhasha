"use client"
import Link from "next/link"
import { useAuth } from "@/modules/auth/contexts/authContext"

const Navbar=()=>{
    const {user,logout} = useAuth()
    return (<>
            <div className="flex justify-between sticky top-0 bg-white">
                <div className="p-4">Matribhasha</div>
                <div className="flex items-center justify-center mx-4">
                    <Link className="hover:bg-gray-50 p-2 rounded" href={"Developer"}>Developer</Link>
                    <Link className="hover:bg-gray-50 p-2 rounded" href={"/"}>Homepage</Link>
                    {user?<><Link className="hover:bg-gray-50 p-2 rounded" href={"/Profile"}>Profile</Link>
                        <button className="bg-red-700" onClick={logout}>Logout</button></>:
                    <><Link className="hover:bg-gray-50 p-2 rounded" href={"/Login"}>LogIn</Link>
                    <Link className="hover:bg-gray-50 p-2 rounded" href={"/Signup"}>SignIn</Link></>
                    }
                </div>
            </div>
        </>
    )
}

export default Navbar