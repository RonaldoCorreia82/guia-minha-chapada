'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateProfile(_: unknown, formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { error: 'Não autenticado.' }

  const name = formData.get('name') as string
  const bio = formData.get('bio') as string
  const city = formData.get('city') as string
  const whatsapp = formData.get('whatsapp') as string

  const { error } = await supabase
    .from('profiles')
    .update({ name, bio, city, whatsapp })
    .eq('id', user.id)

  if (error) return { error: 'Erro ao salvar perfil.' }

  revalidatePath('/painel/perfil')
  return { success: true }
}
