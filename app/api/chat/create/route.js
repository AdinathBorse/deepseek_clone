import dbConnect from "@/config/db";
import Chat from "@/models/Chat";
import { NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";

export async function POST(req) {
    try {
        const { userId } = getAuth(req);
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        //prapare the chat data to be saved in the database
        const chatData = {
            userId,
            Messages:[],
            name:"New Chat",
        };

        // connect to database and create a new chat
        await dbConnect();
        await Chat.create(chatData);
        return NextResponse.json({success: true, message: "Chat created successfully"});
    } catch (error) {
        return NextResponse.json({success: false, error: error.message});
    }
}