"use client"
import Link from "next/link"
import { useAuth } from "@/modules/auth/contexts/authContext"

const Navbar=()=>{
    const {user,logout} = useAuth()
    return (<>
            <div className="flex justify-around sticky top-0 bg-white z-50">
                <div className="p-4">Matribhasha</div>
                <div className="flex items-center justify-center mx-4">
                    <Link className="hover:bg-gray-50 p-2 rounded" href={"/"}>Homepage</Link>
                    <Link className="hover:bg-gray-50 p-2 rounded" href={"/Books"}>Books</Link>
                    <Link className="hover:bg-gray-50 p-2 rounded" href={"/Dashboard"}>Dashboard</Link>
                    {user?<><Link className="hover:bg-gray-50 p-2 rounded" href={"/Profile"}>Profile</Link>
                        <button className="cursor-pointer bg-red-700 px-2 py-1 text-white rounded hover:bg-red-800 m-2" onClick={logout}>Logout</button></>:
                    <Link className="hover:bg-gray-50 p-2 rounded" href={"/Login"}>LogIn</Link>
                    }
                </div>
            </div>
        </>
    )
}

export default Navbar