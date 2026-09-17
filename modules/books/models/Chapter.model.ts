import mongoose from "mongoose";

const ChapterSchema = new mongoose.Schema(
    {
        pageStart:
        {
            type: Number,
            required:true
        },

        pageEnd:
        {
            type:Number,
            required:true
        },

        title:
        {
            type:String,
            required:true
        },

        language:
        {
            type:String,
            required:true
        },

        bookUUID:
        {
            type:String,
            required:true
        }
    }
)

const Chapter = mongoose.models.Chapter || mongoose.model("Chapter", ChapterSchema);
export default Chapter;