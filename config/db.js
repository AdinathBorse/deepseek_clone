import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.warn("MONGODB_URI is not set in environment");
}

let cached = global.mongoose || (global.mongoose = { conn: null, promise: null });

export default async function dbConnect() {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {}).then((mongoose) => mongoose);
  }
  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (error) {
    console.error("Error connecting to mongoDB:", error);
    cached.promise = null;
    throw error;
  }
}