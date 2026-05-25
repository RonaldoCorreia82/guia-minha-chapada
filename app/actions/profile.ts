'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateProfile(_: unknown, formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { error: 'Não autenticado.' }

  const bool = (field: string) => formData.get(field) === 'on'

  const { error } = await supabase
    .from('profiles')
    .update({
      name:     formData.get('name') as string,
      bio:      formData.get('bio') as string,
      city:     formData.get('city') as string,
      whatsapp: formData.get('whatsapp') as string,
      // idiomas
      lang_pt:  bool('lang_pt'),
      lang_en:  bool('lang_en'),
      lang_es:  bool('lang_es'),
      // diferenciais
      feat_dicas:         bool('feat_dicas'),
      feat_personalizado: bool('feat_personalizado'),
      feat_familias:      bool('feat_familias'),
      feat_24h:           bool('feat_24h'),
      feat_cadastur:      bool('feat_cadastur'),
    })
    .eq('id', user.id)

  if (error) return { error: 'Erro ao salvar perfil.' }

  revalidatePath('/painel/perfil')
  return { success: true }
}
