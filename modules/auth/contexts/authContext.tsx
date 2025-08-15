"use client"
import React,{ useContext , useState, useEffect, createContext} from "react";
import type { AuthContextType, User } from "../../user/types/auth";

const AuthContext = createContext<AuthContextType|undefined>(undefined)

export const AuthProvider:React.FC<{children:React.ReactNode}>=({children})=>{
    const [user, setUser] = useState<User|null>(null);
    const [token,setToken] = useState<string|null>(null)
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(()=>{
        const storedUser = localStorage.getItem('user');
        const token = localStorage.getItem('token')
        if(storedUser) setUser(JSON.parse(storedUser))
        if(token) setToken(token)
        setLoading(false)
    },[]);

    const login = async (email:string, password:string)=>{
        setLoading(true);
        try
        {
            const data = await fetch("/api/v1/login",{
                method:"POST",
                body: JSON.stringify({email,password})
            })
            if(data.ok)
            {
                const {user,token} = await data.json()
                localStorage.setItem("token",token)
                setToken(token)
                localStorage.setItem("user",JSON.stringify(user));
                setUser(user)
            }
        }
        finally
        {
            setLoading(false)
        }
    };

    const signup = async (email:string,password:string,username:string)=>{
        setLoading(true);
        try{
            const data = await fetch("/api/v1/signup",{
                method:"POST",
                body:JSON.stringify({email,password,username})
            })

            if(data.ok){
                const {user,token} = await data.json()
                localStorage.setItem("user",user)
                setUser(user)
                localStorage.setItem("token",token)
                setToken(token)
            }
            
        }
        finally
        {
            setLoading(false)
        }
    }

    const logout = () =>{
        localStorage.removeItem("user");
        setUser(null);
    };

    const value:AuthContextType = {user, login, logout, loading,token,signup}

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
};

export function useAuth():AuthContextType{
    const context = useContext(AuthContext)
    if(!context){
        throw new Error("useAuth must be used within AuthProvider");
    }
    return context;
}