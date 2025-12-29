import dbConnect from "@/config/db";
import Chat from "@/models/Chat";
import { NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";


export async function POST(req) {
    try {
         const { userId } = getAuth(req);
         const { chatId } = await req.json();

        if (!userId) {
            return NextResponse.json(
                {
                    success : false,
                    message : "Unauthorized"
                }
            );
        }

        // connect to database and delete the chat
        await dbConnect();
        await Chat.findOneAndDelete({ _id: chatId, userId });

        return NextResponse.json({success: true, message: "Chat deleted successfully"});
    } catch (error) {
        return NextResponse.json({success: false, error: error.message});
    }
}