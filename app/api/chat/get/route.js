import dbConnect from "@/config/db";
import Chat from "@/models/Chat";
import { NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";

export async function GET(req) {
    try {
        const { userId } = getAuth(req);

        if (!userId) {
            return NextResponse.json(
                {
                    success : false,
                    message : "Unauthorized"
                }
            );
        }

        // connect to database and fetch chats for the authenticated user
        await dbConnect();
        const data = await Chat.find({userId});
        return NextResponse.json({success: true, data});
    } catch (error) {
        return NextResponse.json({success: false, error: error.message});
    }
}