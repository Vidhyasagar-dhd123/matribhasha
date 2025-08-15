import mongoose from "mongoose";

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
    return cache.conn
}

export default connection