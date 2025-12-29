export const maxDuration = 60;
export const runtime = "nodejs";

import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import OpenAI from "openai";
import dbConnect from "@/config/db";
import Chat from "@/models/Chat";

export async function POST(req) {
  try {
    // 🔐 Clerk auth
    const { userId } = getAuth(req);
    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { prompt, chatId } = await req.json();
    if (!prompt || !chatId) {
      return NextResponse.json(
        { success: false, message: "Missing prompt or chatId" },
        { status: 400 }
      );
    }

    // 🔑 Env check
    if (!process.env.OPENROUTER_API_KEY) {
      throw new Error("OPENROUTER_API_KEY is missing");
    }

    // 🧠 Create OpenRouter client INSIDE handler
    const openai = new OpenAI({
      baseURL: "https://openrouter.ai/api/v1",
      apiKey: process.env.OPENROUTER_API_KEY,
      defaultHeaders: {
        "X-Title": "My NextJS App",
      },
    });

    // 🗄️ DB
    await dbConnect();
    const data = await Chat.findOne({ _id: chatId, userId });

    if (!data) {
      return NextResponse.json(
        { success: false, message: "Chat not found" },
        { status: 404 }
      );
    }

    // Save user message
    data.messages.push({
      role: "user",
      content: prompt,
      timestamp: Date.now(),
    });

    // 🤖 AI call
    const completion = await openai.chat.completions.create({
      model: "deepseek/deepseek-chat",
      messages: [{ role: "user", content: prompt }],
    });

    const aiMessage = {
      role: "assistant",
      content: completion.choices[0].message.content,
      timestamp: Date.now(),
    };

    data.messages.push(aiMessage);
    await data.save();

    return NextResponse.json({ success: true, data: aiMessage });
  } catch (error) {
    console.error("AI route error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
