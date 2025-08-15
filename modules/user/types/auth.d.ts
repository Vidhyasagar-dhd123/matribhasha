export interface User{
    id:string;
    username:string;
    email:string;
}

export interface AuthContextType{
    user:User|null;
    login:(email:string,password:string,) => Promise<void>;
    signup:(email:string,password:string,username:string)=> Promise<void>;
    logout:()=>void;
    loading:boolean;
    token:string|null;
}