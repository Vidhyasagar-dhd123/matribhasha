import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        name:{
            type:String,
            required:true,
            trim:true
        },
        username:{
            type:String,
            unique:true,
            sparse:true,
            trim:true,
            lowercase:true
        },
        email:{
            type:String,
            unique:true,
            required:true,
            trim:true,
            lowercase:true
        },
        password:{
            type:String,
            required:true
        },
        role:{
            type:String,
            enum:["user","admin"],
            default:"user"
        },
        languages:[
            {
                name:
                {
                    type:String,
                }
            }
        ],
        bio:{
            type:String,
            default:""
        },
        isBlocked:{
            type:Boolean,
            default:false
        }
    },
    {
        timestamps:true
    }
);

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User