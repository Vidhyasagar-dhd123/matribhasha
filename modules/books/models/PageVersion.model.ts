import mongoose from "mongoose";

const PageVersionSchema = new mongoose.Schema(
    {
        language:
        {
            type:String
        },
        
        content:
        {
            type:String,
            default:"No Content Available"
        },

        pageId:
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Page"
        },

        authorId:
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        }
    },
    {
        timestamps:true
    }
)

const PageVersion = mongoose.models.PageVersion || mongoose.model("PageVersion",PageVersionSchema)

export default PageVersion