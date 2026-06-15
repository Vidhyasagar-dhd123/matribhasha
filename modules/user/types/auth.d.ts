export interface User{
    _id:string;
    name:string;
    username?:string;
    email:string;
    isBlocked:boolean;
    role?:"user"|"admin";
    languages?: { name?: string }[];
    bio?: string;
}

export interface AuthContextType{
    user:User|null;
    login:(email:string,password:string,) => Promise<void>;
    signup:(email:string,password:string,username:string)=> Promise<void>;
    logout:()=>void;
    loading:boolean;
    token:string|null;
}