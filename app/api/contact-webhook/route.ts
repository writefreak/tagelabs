import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    console.log("📥 Formspree webhook received:", body);

    const { error } = await supabase.from("contacts").insert({
      name: body.name ?? "Unknown",
      email: body.email ?? "",
      subject: body.subject ?? "No subject",
      message: body.message ?? "",
      read: false,
    });

    if (error) {
      console.error("❌ Supabase insert error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error("❌ Webhook handler error:", err);
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}