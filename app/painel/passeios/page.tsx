import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { Plus, Trash2 } from 'lucide-react'
import { deletePasseio } from '@/app/actions/passeios'
import { CATEGORIES, PLAN_LIMITS, type Category, type Plan } from '@/types'

export default async function PasseiosPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/entrar')

  const { data: profile } = await supabase.from('profiles').select('plan').eq('id', user.id).single()
  const { data: passeios } = await supabase
    .from('passeios')
    .select('*')
    .eq('guide_id', user.id)
    .order('created_at', { ascending: false })

  const plano = (profile?.plan ?? 'free') as Plan
  const limite = PLAN_LIMITS[plano]
  const total = passeios?.length ?? 0
  const podeAdicionar = total < limite

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Meus Passeios</h1>
          <p className="text-gray-500 text-sm">
            {total} de {limite} passeios ({plano})
          </p>
        </div>
        {podeAdicionar ? (
          <Link href="/painel/passeios/novo">
            <Button className="bg-green-700 hover:bg-green-800">
              <Plus className="mr-1 h-4 w-4" />
              Novo passeio
            </Button>
          </Link>
        ) : (
          <Button disabled title={`Limite do plano ${plano} atingido`}>
            <Plus className="mr-1 h-4 w-4" />
            Novo passeio
          </Button>
        )}
      </div>

      {!podeAdicionar && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800">
          Você atingiu o limite de {limite} passeio(s) do plano {plano}. Faça upgrade para adicionar mais.
        </div>
      )}

      {passeios && passeios.length > 0 ? (
        <div className="space-y-3">
          {passeios.map((p) => (
            <Card key={p.id}>
              <CardContent className="py-4 flex items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium text-gray-900 truncate">{p.title}</span>
                    <Badge variant="outline" className="text-xs">
                      {CATEGORIES[p.category as Category]}
                    </Badge>
                  </div>
                  {p.price_estimate && (
                    <p className="text-sm text-gray-500 mt-0.5">{p.price_estimate}</p>
                  )}
                </div>
                <form
                  action={async () => {
                    'use server'
                    await deletePasseio(p.id)
                  }}
                >
                  <Button type="submit" size="sm" variant="ghost" className="text-red-500 hover:text-red-700 hover:bg-red-50">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </form>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 text-gray-400 space-y-3">
          <p>Nenhum passeio cadastrado ainda.</p>
          {podeAdicionar && (
            <Link href="/painel/passeios/novo">
              <Button variant="outline" size="sm">Cadastrar meu primeiro passeio</Button>
            </Link>
          )}
        </div>
      )}
    </div>
  )
}
