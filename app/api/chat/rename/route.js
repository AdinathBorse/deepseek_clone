import dbConnect from "@/config/db";
import Chat from "@/models/Chat";
import { NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";

export async function POST(req) {
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

        const { chatId, name } = await req.json();
        // connect to database and update the chat name
        await dbConnect();
        await Chat.findOneAndUpdate({ _id: chatId, userId }, { name });

        return NextResponse.json({success: true, message: "Chat renamed successfully"});
    } catch (error) {
        return NextResponse.json({success: false, error: error.message});
    }
}