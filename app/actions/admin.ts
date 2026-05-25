'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import type { Plan } from '@/types'

async function verificarAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  const { data } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  return data?.role === 'admin' ? supabase : null
}

export async function atualizarPlano(guideId: string, plan: Plan): Promise<void> {
  const supabase = await verificarAdmin()
  if (!supabase) return
  await supabase.from('profiles').update({ plan }).eq('id', guideId)
  revalidatePath('/admin/guias')
}

export async function toggleVerificado(guideId: string, verificado: boolean): Promise<void> {
  const supabase = await verificarAdmin()
  if (!supabase) return
  await supabase.from('profiles').update({ verified: verificado }).eq('id', guideId)
  revalidatePath('/admin/guias')
}

export async function deletarGuia(guideId: string): Promise<void> {
  const supabase = await verificarAdmin()
  if (!supabase) return
  await supabase.from('profiles').delete().eq('id', guideId)
  revalidatePath('/admin/guias')
}

export async function togglePasseioAtivo(passeioId: string, ativo: boolean): Promise<void> {
  const supabase = await verificarAdmin()
  if (!supabase) return
  await supabase.from('passeios').update({ active: ativo }).eq('id', passeioId)
  revalidatePath('/admin/passeios')
}

export async function deletarPasseio(passeioId: string): Promise<void> {
  const supabase = await verificarAdmin()
  if (!supabase) return
  await supabase.from('passeios').delete().eq('id', passeioId)
  revalidatePath('/admin/passeios')
}
