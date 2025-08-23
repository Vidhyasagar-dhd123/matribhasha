import mongoose from "mongoose";
import User from "@/modules/user/models/user.model";
import Page from "@/modules/books/models/Pages.model";
import PageVersion from "@/modules/books/models/PageVersion.model";

const MONGODB_URI = process.env.MONGODB_URI

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

let cache = global.mongoose

if(!cache){
    cache = global.mongoose = {conn:null,promise:null}
}

async function connection(){
    if(cache.conn) return cache.conn;
    if(!cache.promise){
        cache.promise = mongoose.connect(MONGODB_URI,{
            dbName:"Matribhasha",
        })
        .then((mongoose)=> mongoose);
    };
    cache.conn = await cache.promise

    if (!mongoose.models.User) {
        mongoose.model("User", User.schema);
    }
    if (!mongoose.models.Page) {
        mongoose.model("Page", Page.schema);
    }
    if (!mongoose.models.PageVersion) {
        mongoose.model("PageVersion", PageVersion.schema);
    }

    return cache.conn
}

export default connection