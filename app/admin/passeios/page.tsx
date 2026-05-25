import { createClient } from '@/lib/supabase/server'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Eye, EyeOff } from 'lucide-react'
import { togglePasseioAtivo, deletarPasseio } from '@/app/actions/admin'
import { DeleteButton } from '@/components/admin/delete-button'
import { CATEGORIES, type Category } from '@/types'

const CATEGORIA_COR: Record<Category, string> = {
  trilhas: 'bg-green-100 text-green-700',
  cachoeiras: 'bg-blue-100 text-blue-700',
  canions: 'bg-orange-100 text-orange-700',
  travessias: 'bg-purple-100 text-purple-700',
}

export default async function AdminPasseiosPage() {
  const supabase = await createClient()

  const { data: passeios } = await supabase
    .from('passeios')
    .select('*, profiles(name, city)')
    .order('created_at', { ascending: false })

  const ativos = passeios?.filter((p) => p.active).length ?? 0
  const inativos = (passeios?.length ?? 0) - ativos

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Passeios</h1>
          <p className="text-gray-500 text-sm">
            {passeios?.length ?? 0} total · {ativos} ativos · {inativos} inativos
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {passeios?.map((p) => {
          const guide = p.profiles as unknown as { name: string; city: string } | null
          const cat = p.category as Category
          return (
            <Card key={p.id}>
              <CardContent className="py-4 flex flex-wrap items-center gap-4">
                {/* Info */}
                <div className="flex-1 min-w-0 space-y-0.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`font-medium text-sm ${!p.active ? 'text-gray-400 line-through' : 'text-gray-900'}`}>
                      {p.title}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${CATEGORIA_COR[cat]}`}>
                      {CATEGORIES[cat]}
                    </span>
                    {!p.active && (
                      <Badge variant="outline" className="text-xs text-gray-400 border-gray-200">
                        Inativo
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-gray-400">
                    {guide?.name ?? '—'} · {guide?.city ?? '—'}
                    {p.price_estimate && ` · ${p.price_estimate}`}
                  </p>
                </div>

                {/* Ações */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <form action={togglePasseioAtivo.bind(null, p.id, !p.active)}>
                    <Button
                      type="submit"
                      size="sm"
                      variant="outline"
                      title={p.active ? 'Desativar passeio' : 'Ativar passeio'}
                    >
                      {p.active
                        ? <EyeOff className="h-4 w-4 text-gray-400" />
                        : <Eye className="h-4 w-4 text-green-600" />}
                    </Button>
                  </form>
                  <DeleteButton
                    action={deletarPasseio.bind(null, p.id)}
                    confirmMessage={`Deletar "${p.title}"?`}
                  />
                </div>
              </CardContent>
            </Card>
          )
        })}

        {(!passeios || passeios.length === 0) && (
          <p className="text-center text-gray-400 py-16">Nenhum passeio cadastrado ainda.</p>
        )}
      </div>
    </div>
  )
}
