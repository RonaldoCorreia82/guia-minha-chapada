import { createClient } from '@/lib/supabase/server'
import { Navbar } from '@/components/navbar'
import { GuiaCard } from '@/components/guia-card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import type { Profile } from '@/types'

const CATEGORIAS = [
  { slug: 'trilhas', label: 'Trilhas' },
  { slug: 'cachoeiras', label: 'Cachoeiras' },
  { slug: 'canions', label: 'Cânions' },
  { slug: 'travessias', label: 'Travessias' },
]

interface Props {
  searchParams: Promise<{ categoria?: string }>
}

export default async function GuiasPage({ searchParams }: Props) {
  const { categoria } = await searchParams
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let query = supabase
    .from('profiles')
    .select('*')
    .order('plan', { ascending: false })
    .order('created_at', { ascending: false })

  if (categoria) {
    const { data: guiaIds } = await supabase
      .from('passeios')
      .select('guide_id')
      .eq('category', categoria)
      .eq('active', true)
    const ids = [...new Set((guiaIds ?? []).map((p) => p.guide_id))]
    if (ids.length > 0) {
      query = query.in('id', ids)
    } else {
      return (
        <div className="flex flex-col min-h-screen">
          <Navbar isLoggedIn={!!user} />
          <main className="flex-1 max-w-5xl mx-auto px-4 py-10 w-full">
            <FiltrosCategorias ativa={categoria} />
            <p className="text-gray-500 mt-8 text-center">Nenhum guia com passeios nessa categoria ainda.</p>
          </main>
        </div>
      )
    }
  }

  const { data: guias } = await query

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar isLoggedIn={!!user} />
      <main className="flex-1 max-w-5xl mx-auto px-4 py-10 w-full">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-1">Guias da Chapada</h1>
          <p className="text-gray-500">
            {guias?.length ?? 0} guia{(guias?.length ?? 0) !== 1 ? 's' : ''} cadastrado{(guias?.length ?? 0) !== 1 ? 's' : ''}
          </p>
        </div>

        <FiltrosCategorias ativa={categoria} />

        <div className="grid gap-4 md:grid-cols-2 mt-6">
          {(guias as Profile[] | null)?.map((guide) => (
            <GuiaCard key={guide.id} guide={guide} />
          ))}
        </div>

        {(!guias || guias.length === 0) && (
          <p className="text-center text-gray-500 py-16">Nenhum guia cadastrado ainda.</p>
        )}
      </main>
    </div>
  )
}

function FiltrosCategorias({ ativa }: { ativa?: string }) {
  return (
    <div className="flex flex-wrap gap-2">
      <Link href="/guias">
        <Badge variant={!ativa ? 'default' : 'outline'} className="cursor-pointer text-sm px-3 py-1">
          Todos
        </Badge>
      </Link>
      {CATEGORIAS.map((c) => (
        <Link key={c.slug} href={`/guias?categoria=${c.slug}`}>
          <Badge variant={ativa === c.slug ? 'default' : 'outline'} className="cursor-pointer text-sm px-3 py-1">
            {c.label}
          </Badge>
        </Link>
      ))}
    </div>
  )
}
