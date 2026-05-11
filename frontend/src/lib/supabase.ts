import { createBrowserClient, createServerClient as createSupabaseServerClient } from "@supabase/ssr";

/**
 * Supabase browser client — used throughout the frontend for auth & data.
 *
 * Requires these environment variables in .env.local:
 *   NEXT_PUBLIC_SUPABASE_URL
 *   NEXT_PUBLIC_SUPABASE_ANON_KEY
 *
 * If not configured, returns null — auth features will be disabled gracefully.
 */

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const isSupabaseConfigured =
  !!supabaseUrl &&
  !!supabaseAnonKey &&
  supabaseUrl !== "your-supabase-project-url" &&
  supabaseAnonKey !== "your-supabase-anon-key";

let client: ReturnType<typeof createBrowserClient> | null = null;

/**
 * Create Supabase browser client (singleton)
 * Used in client components and client-side code
 */
export function createClient() {
  if (!isSupabaseConfigured) return null;

  if (!client) {
    client = createBrowserClient(supabaseUrl!, supabaseAnonKey!);
  }
  return client;
}

/**
 * Create Supabase server client for SSR contexts
 * Used in server components, route handlers, and API routes
 * 
 * @param cookieStore - The Next.js cookie store from await cookies()
 * @returns Supabase client configured for server-side rendering
 */
export function createServerClient(cookieStore: {
  getAll(): { name: string; value: string }[];
  set(name: string, value: string, options?: any): void;
}) {
  if (!isSupabaseConfigured) return null;

  return createSupabaseServerClient(
    supabaseUrl!,
    supabaseAnonKey!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  );
}
