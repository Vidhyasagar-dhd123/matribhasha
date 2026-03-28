import mongoose from "mongoose";

const BookSchema = new mongoose.Schema(
    {
        title:
        {
            type:String,
            required:true
        },

        uuid:
        {
            type:String,
            required:true
        },

        author:
        {
            type:String,
            required:true
        },

        originalLanguage:
        {
            type:String,
            required:true
        },

        totalPages:
        {
            type:Number,
        },

        chapters:
        [
            {type:mongoose.Schema.Types.ObjectId, ref:"Chapters"}
        ],

        pages:
        [
            {type:mongoose.Schema.Types.ObjectId,ref:"Pages"}
        ],

        description:
        {
            type:String,
        },
        genre:
        {
            type:String,
        },
        isbn13:
        {
            type:String,
        },

        uploaded:{
            type:Boolean,
            default:false
        },

        translatedLanguages:
        [
            {
                type:String,
            }
        ],

        isTranslated:
        {
            type:Boolean,
            default:false
        },

        uploadURI:
        {
            type:String,
        },

        coverURI:
        {
            type:String,
        }
    },
    {
        timestamps:true
    }
)

const Book = mongoose.models.Book || mongoose.model("Book",BookSchema)

export default Book