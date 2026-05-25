import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Navbar } from '@/components/navbar'
import { GuiaCard } from '@/components/guia-card'
import { Button } from '@/components/ui/button'
import { Mountain, Waves, TreePine, Footprints, ChevronRight } from 'lucide-react'
import type { Profile } from '@/types'

export default async function HomePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: guiasDestaque } = await supabase
    .from('profiles')
    .select('*')
    .eq('plan', 'premium')
    .limit(6)
    .order('created_at', { ascending: false })

  const { data: todosGuias } = await supabase
    .from('profiles')
    .select('*')
    .limit(9)
    .order('plan', { ascending: false })
    .order('created_at', { ascending: false })

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar isLoggedIn={!!user} />

      {/* Hero */}
      <section className="bg-gradient-to-br from-green-800 via-green-700 to-teal-600 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h1 className="text-4xl md:text-5xl font-bold leading-tight">
            Descubra a Chapada Diamantina
            <br />
            <span className="text-green-200">com quem conhece cada trilha</span>
          </h1>
          <p className="text-lg text-green-100 max-w-2xl mx-auto">
            Conectamos você aos melhores guias locais. Cachoeiras, cânions, trilhas e travessias — com segurança e autenticidade.
          </p>
          <div className="flex flex-wrap gap-3 justify-center pt-2">
            <Link href="/guias">
              <Button size="lg" className="bg-white text-green-800 hover:bg-green-50 font-semibold">
                Encontrar guias
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/cadastro">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                Sou guia, quero me cadastrar
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Categorias */}
      <section className="py-12 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-800 text-center mb-8">O que você quer explorar?</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: Footprints, label: 'Trilhas', slug: 'trilhas', color: 'bg-green-50 text-green-700 border-green-200' },
              { icon: Waves, label: 'Cachoeiras', slug: 'cachoeiras', color: 'bg-blue-50 text-blue-700 border-blue-200' },
              { icon: Mountain, label: 'Cânions', slug: 'canions', color: 'bg-orange-50 text-orange-700 border-orange-200' },
              { icon: TreePine, label: 'Travessias', slug: 'travessias', color: 'bg-purple-50 text-purple-700 border-purple-200' },
            ].map(({ icon: Icon, label, slug, color }) => (
              <Link key={slug} href={`/guias?categoria=${slug}`}>
                <div className={`flex flex-col items-center gap-3 p-6 rounded-xl border-2 ${color} hover:shadow-md transition-shadow cursor-pointer`}>
                  <Icon className="h-8 w-8" />
                  <span className="font-semibold">{label}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Guias Verificados (Premium) */}
      {guiasDestaque && guiasDestaque.length > 0 && (
        <section className="py-12 px-4 bg-amber-50">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Guias Verificados</h2>
                <p className="text-gray-500 text-sm">Profissionais com credencial verificada pela plataforma</p>
              </div>
              <Link href="/guias">
                <Button variant="ghost" className="text-green-700">Ver todos</Button>
              </Link>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {(guiasDestaque as Profile[]).map((guide) => (
                <GuiaCard key={guide.id} guide={guide} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Todos os guias */}
      {todosGuias && todosGuias.length > 0 && (
        <section className="py-12 px-4">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Todos os guias</h2>
              <Link href="/guias">
                <Button variant="ghost" className="text-green-700">Ver todos</Button>
              </Link>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {(todosGuias as Profile[]).map((guide) => (
                <GuiaCard key={guide.id} guide={guide} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA guias */}
      <section className="py-16 px-4 bg-green-800 text-white mt-auto">
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <h2 className="text-3xl font-bold">Você é guia na Chapada?</h2>
          <p className="text-green-200">
            Cadastre-se gratuitamente e comece a receber turistas interessados nos seus passeios.
          </p>
          <Link href="/cadastro">
            <Button size="lg" className="bg-white text-green-800 hover:bg-green-50 font-semibold mt-2">
              Criar meu perfil grátis
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
