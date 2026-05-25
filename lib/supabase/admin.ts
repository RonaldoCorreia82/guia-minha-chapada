import { createClient } from '@supabase/supabase-js'

// Cliente com service role — só usar em rotas de servidor sem sessão de usuário (ex: webhooks)
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  )
}
