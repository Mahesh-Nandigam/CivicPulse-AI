import { NextResponse } from "next/server";
import { chatWithSana } from "@/lib/sana-engine";

export async function POST(req: Request) {
  try {
    const { prompt, context, history, state } = await req.json();
    const response = await chatWithSana(prompt, context, history, state);
    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 });
  }
}
