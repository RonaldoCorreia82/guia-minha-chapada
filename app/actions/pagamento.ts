'use server'

import { createClient } from '@/lib/supabase/server'
import { mpClient } from '@/lib/mercadopago'
import { Preference } from 'mercadopago'
import { redirect } from 'next/navigation'

const PLANOS = {
  pro:     { preco: 1.00, nome: 'Plano Pro — Guia Minha Chapada' },
  premium: { preco: 49.00, nome: 'Plano Premium — Guia Minha Chapada' },
}

export async function criarPagamento(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/entrar')

  const plano = formData.get('plano') as keyof typeof PLANOS
  if (!plano || !PLANOS[plano]) redirect('/painel/plano')

  const { preco, nome } = PLANOS[plano]
  const appUrl = process.env.NEXT_PUBLIC_APP_URL

  const preference = new Preference(mpClient)

  const result = await preference.create({
    body: {
      items: [
        {
          id: plano,
          title: nome,
          unit_price: preco,
          quantity: 1,
          currency_id: 'BRL',
        },
      ],
      payer: { email: user.email },
      back_urls: {
        success: `${appUrl}/painel/plano/sucesso`,
        failure: `${appUrl}/painel/plano`,
        pending: `${appUrl}/painel/plano/pendente`,
      },
      auto_return: 'approved',
      // referência usada no webhook para identificar o guia e o plano
      external_reference: `${user.id}:${plano}`,
      notification_url: `${appUrl}/api/webhooks/mercadopago`,
    },
  })

  if (!result.init_point) redirect('/painel/plano')

  redirect(result.init_point)
}
