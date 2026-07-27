// lib/supabase.ts
import { createBrowserClient } from "@supabase/ssr";

export const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

console.log('SUPABASE URL:', JSON.stringify(process.env.NEXT_PUBLIC_SUPABASE_URL));
console.log('SUPABASE KEY:', JSON.stringify(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY));