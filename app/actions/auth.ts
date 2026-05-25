'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function signIn(_: unknown, formData: FormData) {
  const supabase = await createClient()
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const { error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) return { error: 'Email ou senha incorretos.' }

  redirect('/painel')
}

export async function signUp(_: unknown, formData: FormData) {
  const supabase = await createClient()
  const name = formData.get('name') as string
  const city = formData.get('city') as string
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { name, city } },
  })

  if (error) return { error: 'Não foi possível criar a conta. Tente outro e-mail.' }

  redirect('/painel')
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/entrar')
}
