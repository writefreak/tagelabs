import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  let res = NextResponse.next({
    request: {
      headers: req.headers,
    },
  });

  // Skip middleware entirely for the auth callback route
  // so Supabase can exchange the code and set cookies freely
  if (req.nextUrl.pathname.startsWith("/auth/callback")) {
    return res;
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return req.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          req.cookies.set({ name, value, ...options });
          // ✅ Must recreate `res` after mutating request cookies,
          // otherwise the Set-Cookie header won't be carried forward
          res = NextResponse.next({ request: { headers: req.headers } });
          res.cookies.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          req.cookies.set({ name, value: "", ...options });
          res = NextResponse.next({ request: { headers: req.headers } });
          res.cookies.set({ name, value: "", ...options });
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isAuthPage =
    req.nextUrl.pathname === "/login" ||
    req.nextUrl.pathname === "/signup";
  const isAdminPage = req.nextUrl.pathname.startsWith("/admin");

  if (!user && isAdminPage) {
    const redirectUrl = new URL("/login", req.url);
    // Preserve where they were trying to go
    redirectUrl.searchParams.set("next", req.nextUrl.pathname);
    return NextResponse.redirect(redirectUrl);
  }

  if (user && isAuthPage) {
    return NextResponse.redirect(new URL("/admin", req.url));
  }

  return res;
}

export const config = {
  // Add /auth/callback to the matcher so the early-return above fires
  matcher: ["/admin/:path*", "/login", "/signup", "/auth/callback"],
};