import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { Map, User, ExternalLink, ShieldCheck, Zap, Star } from 'lucide-react'
import { PLAN_INFO, PLAN_LIMITS, type Plan } from '@/types'
import { criarPagamento } from '@/app/actions/pagamento'

export default async function PainelPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/entrar')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  const { count: totalPasseios } = await supabase
    .from('passeios')
    .select('*', { count: 'exact', head: true })
    .eq('guide_id', user.id)

  if (!profile) redirect('/entrar')

  const plan = profile.plan as Plan
  const limite = PLAN_LIMITS[plan]
  const info = PLAN_INFO[plan]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Olá, {profile.name}!</h1>
        <p className="text-gray-500 text-sm">Bem-vindo ao seu painel de guia</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-1">
            <CardTitle className="text-sm font-medium text-gray-500">Plano atual</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold">{info.label}</span>
              {profile.verified && <ShieldCheck className="h-5 w-5 text-green-600" />}
            </div>
            <p className="text-xs text-gray-400">{info.price}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-1">
            <CardTitle className="text-sm font-medium text-gray-500">Passeios cadastrados</CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-xl font-bold">{totalPasseios ?? 0}</span>
            <span className="text-gray-400 text-sm"> / {limite}</span>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-1">
            <CardTitle className="text-sm font-medium text-gray-500">Seu perfil público</CardTitle>
          </CardHeader>
          <CardContent>
            <Link
              href={`/guias/${profile.slug}`}
              className="flex items-center gap-1 text-green-700 font-medium text-sm hover:underline"
            >
              Ver perfil <ExternalLink className="h-3 w-3" />
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Ações rápidas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card>
          <CardContent className="pt-6 flex items-start gap-4">
            <User className="h-8 w-8 text-green-600 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="font-semibold">Meu Perfil</h3>
              <p className="text-sm text-gray-500 mb-3">Atualize foto, bio e WhatsApp</p>
              <Link href="/painel/perfil">
                <Button size="sm" variant="outline">Editar perfil</Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6 flex items-start gap-4">
            <Map className="h-8 w-8 text-green-600 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="font-semibold">Passeios</h3>
              <p className="text-sm text-gray-500 mb-3">Gerencie seus passeios cadastrados</p>
              <Link href="/painel/passeios">
                <Button size="sm" variant="outline">Gerenciar passeios</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upgrade */}
      {plan !== 'premium' && (
        <div>
          <h2 className="text-base font-semibold text-gray-700 mb-3">Faça upgrade do seu plano</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            {/* Pro */}
            {plan === 'free' && (
              <Card className="border-blue-200 bg-blue-50">
                <CardContent className="pt-5 space-y-3">
                  <div className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-blue-600" />
                    <span className="font-bold text-blue-900">Plano Pro</span>
                    <Badge className="bg-blue-100 text-blue-800 border-blue-200 ml-auto">R$ 1/mês</Badge>
                  </div>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>✓ Até 3 passeios cadastrados</li>
                    <li>✓ Botão WhatsApp no seu card</li>
                    <li>✓ Mais visibilidade para turistas</li>
                  </ul>
                  <form action={criarPagamento}>
                    <input type="hidden" name="plano" value="pro" />
                    <Button type="submit" size="sm" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                      Assinar Pro
                    </Button>
                  </form>
                </CardContent>
              </Card>
            )}

            {/* Premium */}
            <Card className="border-amber-200 bg-amber-50">
              <CardContent className="pt-5 space-y-3">
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-amber-600" />
                  <span className="font-bold text-amber-900">Plano Premium</span>
                  <Badge className="bg-amber-100 text-amber-800 border-amber-200 ml-auto">R$ 49/mês</Badge>
                </div>
                <ul className="text-sm text-amber-800 space-y-1">
                  <li>✓ Até 7 passeios cadastrados</li>
                  <li>✓ Destaque na vitrine principal</li>
                  <li>✓ Selo Guia Verificado</li>
                  <li>✓ Posição prioritária na busca</li>
                </ul>
                <form action={criarPagamento}>
                  <input type="hidden" name="plano" value="premium" />
                  <Button type="submit" size="sm" className="w-full bg-amber-600 hover:bg-amber-700 text-white">
                    Assinar Premium
                  </Button>
                </form>
              </CardContent>
            </Card>

          </div>
        </div>
      )}
    </div>
  )
}
