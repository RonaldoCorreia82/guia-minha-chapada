import { NextRequest, NextResponse } from 'next/server'
import { Payment } from 'mercadopago'
import { mpClient } from '@/lib/mercadopago'
import { createAdminClient } from '@/lib/supabase/admin'

// Mercado Pago faz GET para validar o endpoint ao cadastrar
export async function GET() {
  return NextResponse.json({ ok: true })
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    // Ignora notificações que não são de pagamento
    if (body.type !== 'payment' || !body.data?.id) {
      return NextResponse.json({ received: true })
    }

    // Busca o pagamento na API do Mercado Pago para confirmar
    const payment = new Payment(mpClient)
    const pag = await payment.get({ id: String(body.data.id) })

    // Só processa pagamentos aprovados
    if (pag.status !== 'approved') {
      return NextResponse.json({ received: true })
    }

    const ref = pag.external_reference
    if (!ref) return NextResponse.json({ received: true })

    const [userId, plano] = ref.split(':')
    if (!userId || !plano) return NextResponse.json({ received: true })

    // Define validade de 93 dias (3 meses) a partir de hoje
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 93)

    const supabase = createAdminClient()
    const { error } = await supabase
      .from('profiles')
      .update({
        plan: plano,
        plan_expires_at: expiresAt.toISOString(),
      })
      .eq('id', userId)

    if (error) {
      console.error('[webhook] erro ao atualizar plano:', error)
      return NextResponse.json({ error: 'db error' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[webhook] erro:', err)
    return NextResponse.json({ error: 'webhook error' }, { status: 500 })
  }
}
