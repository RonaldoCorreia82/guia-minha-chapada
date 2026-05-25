import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { Map, User, ExternalLink, ShieldCheck } from 'lucide-react'
import { PLAN_INFO, PLAN_LIMITS, type Plan } from '@/types'

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
        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <h3 className="font-semibold text-amber-900">Quer mais visibilidade?</h3>
                <p className="text-sm text-amber-700 mt-1">
                  {plan === 'free'
                    ? 'Faça upgrade para Pro (R$ 29/mês) e cadastre até 3 passeios com WhatsApp em destaque.'
                    : 'Faça upgrade para Premium (R$ 49/mês) e apareça na vitrine principal com Selo Verificado.'}
                </p>
              </div>
              <Badge className="bg-amber-200 text-amber-900 border-amber-300 whitespace-nowrap">
                {plan === 'free' ? 'Pro — R$ 29/mês' : 'Premium — R$ 49/mês'}
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
