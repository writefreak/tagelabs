// app/api/admin/delete-user/route.ts
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // never expose this client-side
);

export async function DELETE(req: Request) {
  const { id } = await req.json();
  const { error } = await supabase.auth.admin.deleteUser(id);
  if (error) return Response.json({ error: error.message }, { status: 400 });
  return Response.json({ success: true });
}