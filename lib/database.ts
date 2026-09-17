import mongoose from "mongoose";
import "@/modules/user/models/user.model";
import "@/modules/user/models/ReadingProgress.model";
import "@/modules/books/models/Book.model";
import "@/modules/books/models/Chapter.model";
import "@/modules/books/models/Pages.model";
import "@/modules/books/models/PageVersion.model";
import "@/modules/books/models/Review.model";
import "@/modules/vivar/models/VivarPost.model";

const MONGODB_URI = process.env.MONGODB_URI;

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: MongooseCache | undefined;
}

const cache: MongooseCache = global.mongooseCache || { conn: null, promise: null };
if (!global.mongooseCache) {
  global.mongooseCache = cache;
}

async function connection(): Promise<typeof mongoose> {
  if (!MONGODB_URI) {
    throw new Error("Please define the MONGODB_URI environment variable");
  }

  if (cache.conn) {
    return cache.conn;
  }

  if (!cache.promise) {
    const opts = {
      dbName: process.env.MONGODB_DB_NAME || "Matribhasha",
      bufferCommands: false,
    };

    cache.promise = mongoose.connect(MONGODB_URI, opts).then((m) => m);
  }

  try {
    cache.conn = await cache.promise;
  } catch (e) {
    cache.promise = null;
    throw e;
  }

  return cache.conn;
}

export default connection;
