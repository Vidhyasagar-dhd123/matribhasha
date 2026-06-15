import mongoose from "mongoose";
import bcrypt from "bcrypt";
import User from "@/modules/user/models/user.model";
import Book from "@/modules/books/models/Book.model";
import Page from "@/modules/books/models/Pages.model";
import PageVersion from "@/modules/books/models/PageVersion.model";
import VivarPost from "@/modules/vivar/models/VivarPost.model";

const MONGODB_URI = process.env.MONGODB_URI

let cache = global.mongoose
let adminSeeded = false

if(!cache){
    cache = global.mongoose = {conn:null,promise:null}
}

async function connection(){
    if (!MONGODB_URI) {
        throw new Error('Please define the MONGODB_URI environment variable');
    }

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
    if (!mongoose.models.Book) {
        mongoose.model("Book", Book.schema);
    }
    if (!mongoose.models.Page) {
        mongoose.model("Page", Page.schema);
    }
    if (!mongoose.models.PageVersion) {
        mongoose.model("PageVersion", PageVersion.schema);
    }
    if (!mongoose.models.VivarPost) {
        mongoose.model("VivarPost", VivarPost.schema);
    }

    if (!adminSeeded) {
        await ensureAdminUser();
        adminSeeded = true;
    }

    return cache.conn
}

async function ensureAdminUser() {
    const email = process.env.ADMIN_EMAIL || "admin@matribhasha.local";
    const password = process.env.ADMIN_PASSWORD || "Admin@12345";
    const name = process.env.ADMIN_NAME || "Matribhasha Admin";

    const existingAdmin = await User.findOne({ email });
    if (existingAdmin) {
        if (existingAdmin.role !== "admin") {
            existingAdmin.role = "admin";
            await existingAdmin.save();
        }
        return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({
        name,
        email,
        password: hashedPassword,
        role: "admin",
    });
}

export default connection
