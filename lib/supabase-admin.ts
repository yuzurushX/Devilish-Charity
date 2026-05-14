import { createServerClient } from '@supabase/ssr'

/**
 * Supabase client for Route Handlers using the service role key.
 * Cookie adapters are no-ops because this app does not use Supabase Auth cookies.
 */
export function createAdminSupabaseClient() {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        getAll: () => [],
        setAll: () => {},
      },
    }
  )
}
