import mongoose from "mongoose";

const PageSchema = new mongoose.Schema(
    {
        bookId : {type:mongoose.Schema.Types.ObjectId, ref:"Book"},

        bookUUID :
        {
            type:String,
            required:true
        },

        pageNumber :
        {
            type : Number,
            required:true,
        },

        originalLanguage:
        {
            type:String,
            required:true
        }
    },
    {
        timestamps:true
    }
)

const Page = mongoose.models.Page || mongoose.model("Page",PageSchema)

export default Page