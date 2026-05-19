// app/api/cv-order/route.ts
import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/app/lib/supabase";

export async function POST(req: NextRequest) {
  const body = await req.json();

  const { error } = await supabase.from("cv_orders").insert({
  name: body.name,
  email: body.email,
  whatsapp: body.whatsapp,
  job_field: body.jobField,
  "current_role": body.currentRole || null,
  "target_role": body.targetRole || null,
  tier: body.tier,
  notes: body.notes || null,
});

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}