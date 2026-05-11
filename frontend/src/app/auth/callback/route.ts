import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerClient } from "@/lib/supabase";

/**
 * OAuth callback route — Supabase redirects here after Google/GitHub login.
 * Exchanges the auth code for a session, then redirects to /dashboard.
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";

  if (code) {
    const cookieStore = await cookies();
    const supabase = createServerClient(cookieStore);

    if (!supabase) {
      // Supabase not configured
      return NextResponse.redirect(`${origin}/login?error=config_error`);
    }

    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // If something goes wrong, redirect to login with an error
  return NextResponse.redirect(`${origin}/login?error=auth_failed`);
}
