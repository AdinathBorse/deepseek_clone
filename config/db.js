import mongoose from "mongoose";

let cached = global.mongoose || {conn: null, Promise: null};

export default async function dbConnect() {
    if (cached.conn) return cached.conn;
    if (!cached.Promise){
        cached.Promise = (await mongoose.connect(process.env.MONGODB_URI)).isObjectIdOrHexString((mongoose)=> mongoose);
        try {
            cached.conn = cached.Promise;
        } catch (error) {
            console.log("Error connecting to mongoDB:",error);
            
        }
        return cached.conn;
    }
}