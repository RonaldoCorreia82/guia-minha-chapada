'use server'

import { createClient } from '@/lib/supabase/server'
import { PLAN_LIMITS } from '@/types'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createPasseio(_: unknown, formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { error: 'Não autenticado.' }

  const { data: profile } = await supabase
    .from('profiles')
    .select('plan')
    .eq('id', user.id)
    .single()

  if (!profile) return { error: 'Perfil não encontrado.' }

  const { count } = await supabase
    .from('passeios')
    .select('*', { count: 'exact', head: true })
    .eq('guide_id', user.id)

  const limite = PLAN_LIMITS[profile.plan as keyof typeof PLAN_LIMITS]
  if ((count ?? 0) >= limite) {
    return { error: `Seu plano ${profile.plan} permite até ${limite} passeio(s). Faça upgrade para adicionar mais.` }
  }

  const photos = ['photo_1', 'photo_2', 'photo_3']
    .map((k) => formData.get(k) as string)
    .filter(Boolean)

  const { error } = await supabase.from('passeios').insert({
    guide_id: user.id,
    title: formData.get('title') as string,
    description: formData.get('description') as string,
    category: formData.get('category') as string,
    price_estimate: formData.get('price_estimate') as string,
    difficulty: formData.get('difficulty') as string,
    duration: formData.get('duration') as string,
    photos: photos.length > 0 ? photos : null,
  })

  if (error) return { error: 'Erro ao salvar passeio.' }

  revalidatePath('/painel/passeios')
  redirect('/painel/passeios')
}

export async function deletePasseio(id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { error: 'Não autenticado.' }

  await supabase.from('passeios').delete().eq('id', id).eq('guide_id', user.id)

  revalidatePath('/painel/passeios')
}
