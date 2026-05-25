import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Check, ShieldCheck, Calendar } from 'lucide-react'
import Link from 'next/link'
import type { Plan } from '@/types'
import { criarPagamento } from '@/app/actions/pagamento'

const PLANOS: {
  id: Plan
  nome: string
  preco: string
  limite: number
  recursos: string[]
}[] = [
  {
    id: 'free',
    nome: 'Grátis',
    preco: 'R$ 0/mês',
    limite: 1,
    recursos: ['1 passeio', 'Perfil público', 'Botão WhatsApp'],
  },
  {
    id: 'pro',
    nome: 'Pro',
    preco: 'R$ 1/mês',
    limite: 3,
    recursos: ['Até 3 passeios', 'Perfil público', 'WhatsApp em destaque'],
  },
  {
    id: 'premium',
    nome: 'Premium',
    preco: 'R$ 49/mês',
    limite: 7,
    recursos: ['Até 7 passeios', 'Destaque na Home', 'Selo Guia Verificado', 'Posição prioritária'],
  },
]

const NIVEL: Record<Plan, number> = { free: 0, pro: 1, premium: 2 }

export default async function PlanoPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/entrar')

  const { data: profile } = await supabase
    .from('profiles')
    .select('plan, verified, name, plan_expires_at')
    .eq('id', user.id)
    .single()

  if (!profile) redirect('/entrar')

  const planoAtual = profile.plan as Plan

  const expiresAt = profile.plan_expires_at
    ? new Date(profile.plan_expires_at)
    : null

  const expirado = expiresAt ? expiresAt < new Date() : false

  return (
    <div className="max-w-3xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Meu Plano</h1>
        <p className="text-gray-500 text-sm">Gerencie sua assinatura na plataforma</p>
      </div>

      {/* Plano atual */}
      <Card className="border-green-200 bg-green-50">
        <CardContent className="pt-6 flex items-center justify-between flex-wrap gap-4">
          <div>
            <p className="text-sm text-green-700 font-medium">Plano atual</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-2xl font-bold text-gray-900">
                {PLANOS.find((p) => p.id === planoAtual)?.nome}
              </span>
              {profile.verified && (
                <span className="flex items-center gap-1 text-xs text-green-700 font-medium bg-green-100 border border-green-200 px-2 py-0.5 rounded-full">
                  <ShieldCheck className="h-3 w-3" />
                  Verificado
                </span>
              )}
              {expirado && planoAtual !== 'free' && (
                <span className="text-xs text-red-600 font-medium bg-red-50 border border-red-200 px-2 py-0.5 rounded-full">
                  Expirado
                </span>
              )}
            </div>
            {expiresAt && !expirado && (
              <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                Válido até {expiresAt.toLocaleDateString('pt-BR')}
              </p>
            )}
            <p className="text-sm text-gray-500 mt-0.5">
              {PLANOS.find((p) => p.id === planoAtual)?.preco}
            </p>
          </div>
          <Link href="/planos">
            <Button variant="outline" size="sm">Ver todos os planos</Button>
          </Link>
        </CardContent>
      </Card>

      {/* Aviso de plano expirado */}
      {expirado && planoAtual !== 'free' && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-800">
          Seu plano expirou. Renove abaixo para continuar com os benefícios.
        </div>
      )}

      {/* Comparação de planos */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {PLANOS.map((plano) => {
          const ativo = plano.id === planoAtual && !expirado
          const podeContratar = NIVEL[plano.id] > NIVEL[planoAtual] || expirado

          return (
            <Card
              key={plano.id}
              className={`relative ${ativo ? 'border-green-500 border-2 overflow-visible' : 'border-gray-200'}`}
            >
              {ativo && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="bg-green-600 text-white text-xs">Plano atual</Badge>
                </div>
              )}
              <CardHeader className="pb-2">
                <CardTitle className="text-base">{plano.nome}</CardTitle>
                <p className="text-sm font-semibold text-gray-700">{plano.preco}</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-1.5">
                  {plano.recursos.map((r) => (
                    <li key={r} className="flex items-center gap-2 text-xs text-gray-600">
                      <Check className="h-3 w-3 text-green-600 flex-shrink-0" />
                      {r}
                    </li>
                  ))}
                </ul>

                {ativo ? (
                  <Button variant="outline" size="sm" className="w-full" disabled>
                    Plano ativo
                  </Button>
                ) : plano.id === 'free' ? (
                  <Button variant="ghost" size="sm" className="w-full text-gray-400" disabled>
                    Plano básico
                  </Button>
                ) : podeContratar ? (
                  <form action={criarPagamento}>
                    <input type="hidden" name="plano" value={plano.id} />
                    <Button
                      type="submit"
                      size="sm"
                      className="w-full bg-green-700 hover:bg-green-800 text-white"
                    >
                      {expirado && plano.id === planoAtual ? 'Renovar plano' : 'Assinar agora'}
                    </Button>
                  </form>
                ) : (
                  <Button variant="ghost" size="sm" className="w-full text-gray-400" disabled>
                    Plano inferior
                  </Button>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      <p className="text-xs text-gray-400 text-center">
        Pagamento seguro via Mercado Pago • PIX, cartão de crédito e boleto aceitos
      </p>
    </div>
  )
}
