import { createClient } from '@/lib/supabase/server'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { ShieldCheck, ShieldOff } from 'lucide-react'
import { toggleVerificado, deletarGuia } from '@/app/actions/admin'
import { DeleteButton } from '@/components/admin/delete-button'
import { PlanSelect } from '@/components/admin/plan-select'
import type { Plan } from '@/types'

export default async function AdminGuiasPage() {
  const supabase = await createClient()

  const { data: guias } = await supabase
    .from('profiles')
    .select('*, passeios(count)')
    .eq('role', 'guide')
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Guias</h1>
        <p className="text-gray-500 text-sm">{guias?.length ?? 0} guias cadastrados</p>
      </div>

      <div className="space-y-3">
        {guias?.map((g) => {
          const totalPasseios = (g.passeios as unknown as { count: number }[])?.[0]?.count ?? 0
          return (
            <Card key={g.id}>
              <CardContent className="py-4 flex flex-wrap items-center gap-4">
                {/* Avatar */}
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                  {g.photo_url ? (
                    <Image src={g.photo_url} alt={g.name} width={40} height={40} className="object-cover w-full h-full" />
                  ) : (
                    <span className="text-sm font-bold text-green-700">{g.name.charAt(0).toUpperCase()}</span>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium text-gray-900">{g.name}</span>
                    {g.verified && <ShieldCheck className="h-4 w-4 text-green-600" />}
                  </div>
                  <p className="text-xs text-gray-400">{g.city} · {totalPasseios} passeio{totalPasseios !== 1 ? 's' : ''}</p>
                </div>

                {/* Plano */}
                <PlanSelect guideId={g.id} planoAtual={g.plan as Plan} />

                {/* Ações */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <form action={toggleVerificado.bind(null, g.id, !g.verified)}>
                    <Button type="submit" size="sm" variant="outline" title={g.verified ? 'Remover verificação' : 'Verificar guia'}>
                      {g.verified
                        ? <ShieldOff className="h-4 w-4 text-gray-400" />
                        : <ShieldCheck className="h-4 w-4 text-green-600" />}
                    </Button>
                  </form>
                  <DeleteButton
                    action={deletarGuia.bind(null, g.id)}
                    confirmMessage={`Deletar o guia "${g.name}"? Esta ação não pode ser desfeita.`}
                  />
                </div>
              </CardContent>
            </Card>
          )
        })}

        {(!guias || guias.length === 0) && (
          <p className="text-center text-gray-400 py-16">Nenhum guia cadastrado ainda.</p>
        )}
      </div>
    </div>
  )
}
