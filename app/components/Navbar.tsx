"use client"
import Link from "next/link"
import { useState } from "react"

const Navbar=()=>{
    const [logged,setLogged] = useState(true)
    return (<>
            <div className="flex justify-between sticky top-0 bg-white">
                <div className="p-4">Matribhasha</div>
                <div className="flex items-center justify-center mx-4">
                    <Link className="hover:bg-gray-50 p-2 rounded" href={"Developer"}>Developer</Link>
                    <Link className="hover:bg-gray-50 p-2 rounded" href={"/"}>Homepage</Link>
                    {logged?<Link className="hover:bg-gray-50 p-2 rounded" href={"/Profile"}>Profile</Link>:
                    <><Link className="hover:bg-gray-50 p-2 rounded" href={"/"}>LogIn</Link>
                    <Link className="hover:bg-gray-50 p-2 rounded" href={"/"}>SignIn</Link></>
                    }
                </div>
            </div>
        </>
    )
}

export default Navbar