export interface User{
    _id:string;
    name:string;
    email:string;
    isBlocked:boolean;
}

export interface AuthContextType{
    user:User|null;
    login:(email:string,password:string,) => Promise<void>;
    signup:(email:string,password:string,username:string)=> Promise<void>;
    logout:()=>void;
    loading:boolean;
    token:string|null;
}