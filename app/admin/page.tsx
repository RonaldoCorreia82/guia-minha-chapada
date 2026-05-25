import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, Map, ShieldCheck, TrendingUp } from 'lucide-react'

export default async function AdminDashboardPage() {
  const supabase = await createClient()

  const [
    { count: totalGuias },
    { count: totalPasseios },
    { count: guiasFree },
    { count: guiasPro },
    { count: guiasPremium },
    { count: guiasVerificados },
    { data: recentes },
  ] = await Promise.all([
    supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'guide'),
    supabase.from('passeios').select('*', { count: 'exact', head: true }),
    supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('plan', 'free').eq('role', 'guide'),
    supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('plan', 'pro').eq('role', 'guide'),
    supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('plan', 'premium').eq('role', 'guide'),
    supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('verified', true),
    supabase.from('profiles').select('id, name, city, plan, created_at').eq('role', 'guide').order('created_at', { ascending: false }).limit(5),
  ])

  const stats = [
    { label: 'Total de guias', value: totalGuias ?? 0, icon: Users, color: 'text-blue-600' },
    { label: 'Total de passeios', value: totalPasseios ?? 0, icon: Map, color: 'text-green-600' },
    { label: 'Guias verificados', value: guiasVerificados ?? 0, icon: ShieldCheck, color: 'text-amber-600' },
    { label: 'Plano Premium', value: guiasPremium ?? 0, icon: TrendingUp, color: 'text-purple-600' },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 text-sm">Visão geral da plataforma</p>
      </div>

      {/* Cards de stats */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <Card key={label}>
            <CardContent className="pt-6 flex items-center gap-4">
              <Icon className={`h-8 w-8 flex-shrink-0 ${color}`} />
              <div>
                <p className="text-2xl font-bold text-gray-900">{value}</p>
                <p className="text-xs text-gray-500">{label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Distribuição por plano */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Distribuição por plano</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { label: 'Grátis', count: guiasFree ?? 0, total: totalGuias ?? 1, color: 'bg-gray-400' },
              { label: 'Pro', count: guiasPro ?? 0, total: totalGuias ?? 1, color: 'bg-blue-500' },
              { label: 'Premium', count: guiasPremium ?? 0, total: totalGuias ?? 1, color: 'bg-amber-500' },
            ].map(({ label, count, total, color }) => (
              <div key={label} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">{label}</span>
                  <span className="font-medium">{count}</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${color}`}
                    style={{ width: total > 0 ? `${(count / total) * 100}%` : '0%' }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Cadastros recentes */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Últimos cadastros</CardTitle>
          </CardHeader>
          <CardContent>
            {recentes && recentes.length > 0 ? (
              <ul className="space-y-3">
                {recentes.map((g) => (
                  <li key={g.id} className="flex items-center justify-between text-sm">
                    <div>
                      <p className="font-medium text-gray-800">{g.name}</p>
                      <p className="text-gray-400 text-xs">{g.city}</p>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      g.plan === 'premium' ? 'bg-amber-100 text-amber-800' :
                      g.plan === 'pro' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      {g.plan}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-400">Nenhum guia cadastrado ainda.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
