import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, email, whatsapp, jobField, currentRole, targetRole, tier, notes } = body;

  const tierLabels: Record<string, string> = {
    essential: "Essential — ₦7,000",
    professional: "Professional — ₦12,000",
    executive: "Executive — ₦15,000",
  };

  try {
    await resend.emails.send({
      from: "TageLabs Orders <onboarding@resend.dev>",
      to: "tagelabstudios@gmail.com",
      subject: `New CV Order from ${name}`,
      html: `
        <div style="font-family: sans-serif; max-width: 560px; margin: 0 auto; color: #112369;">
          <h2 style="margin-bottom: 4px;">New CV Order</h2>
          <p style="color: #888; font-size: 13px; margin-top: 0;">Submitted via tagelabs.vercel.app</p>

          <table style="width: 100%; border-collapse: collapse; margin-top: 24px; font-size: 14px;">
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #888; width: 160px;">Full name</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #eee; font-weight: 600;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #888;">Email</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #eee;">${email}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #888;">WhatsApp</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #eee;">${whatsapp}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #888;">Job field</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #eee;">${jobField}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #888;">Current role</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #eee;">${currentRole || "Not provided"}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #888;">Target role</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #eee;">${targetRole || "Not provided"}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #888;">Package</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #eee; font-weight: 600; color: #4a8fe2;">${tierLabels[tier] ?? tier}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; color: #888; vertical-align: top;">Notes</td>
              <td style="padding: 10px 0;">${notes || "None"}</td>
            </tr>
          </table>

          <p style="margin-top: 32px; font-size: 12px; color: #aaa;">TageLabs · tagelabs.vercel.app</p>
        </div>
      `,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
  }
}