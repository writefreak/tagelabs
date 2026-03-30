import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  // 1. Extract the secret key from the URL params
  const { searchParams } = new URL(req.url);
  const key = searchParams.get('key');

  // 2. Security Check: Compare against your Vercel Environment Variable
  if (!key || key !== process.env.CRON_SECRET) {
    return new Response('Unauthorized: Invalid or missing secret key.', { status: 401 });
  }

  // 3. Initialize a direct Supabase client
  // Ensure these match your .env.local / Vercel settings exactly
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  try {
    // 4. Perform a real DB interaction. 
    // Selecting from 'profiles' or any existing table resets the 7-day pause timer.
    const { data, error } = await supabase
      .from('profiles') 
      .select('id')
      .limit(1);

    if (error) {
      console.error('Supabase Ping Error:', error.message);
      return NextResponse.json({ 
        success: false, 
        error: error.message 
      }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      message: "TageLabs Database is awake and active!",
      timestamp: new Date().toISOString()
    });

  } catch (err) {
    return NextResponse.json({ 
      success: false, 
      message: "An unexpected error occurred during the heartbeat." 
    }, { status: 500 });
  }
}