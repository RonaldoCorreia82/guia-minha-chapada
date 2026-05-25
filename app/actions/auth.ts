'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function signIn(_: unknown, formData: FormData) {
  const supabase = await createClient()
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const { data, error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    if (error.message.toLowerCase().includes('email not confirmed'))
      return { error: 'E-mail ainda não confirmado. Verifique sua caixa de entrada ou desative a confirmação no Supabase.' }
    if (error.message.toLowerCase().includes('invalid login credentials'))
      return { error: 'E-mail ou senha incorretos.' }
    return { error: error.message }
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', data.user.id)
    .single()

  redirect(profile?.role === 'admin' ? '/admin' : '/painel')
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

  if (error) {
    if (error.message.toLowerCase().includes('already registered') || error.message.toLowerCase().includes('already been registered'))
      return { error: 'Este e-mail já está cadastrado. Tente fazer login.' }
    return { error: error.message }
  }

  redirect('/painel')
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/entrar')
}
