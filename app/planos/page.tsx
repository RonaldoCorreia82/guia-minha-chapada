import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Navbar } from '@/components/navbar'
import { Button } from '@/components/ui/button'
import { Check, X, Star } from 'lucide-react'

const PLANOS = [
  {
    id: 'free',
    nome: 'Grátis',
    preco: 'R$ 0',
    periodo: 'para sempre',
    descricao: 'Ideal para começar e testar a plataforma',
    destaque: false,
    cta: 'Criar conta grátis',
    href: '/cadastro',
    recursos: [
      { label: '1 passeio cadastrado', incluso: true },
      { label: 'Página de perfil pública', incluso: true },
      { label: 'Botão WhatsApp no perfil', incluso: true },
      { label: 'Botão WhatsApp em destaque', incluso: false },
      { label: 'Até 3 passeios', incluso: false },
      { label: 'Até 7 passeios', incluso: false },
      { label: 'Destaque na página inicial', incluso: false },
      { label: 'Selo Guia Verificado', incluso: false },
      { label: 'Posição prioritária na busca', incluso: false },
    ],
  },
  {
    id: 'pro',
    nome: 'Pro',
    preco: 'R$ 1',
    periodo: 'por mês',
    descricao: 'Para guias que querem mais visibilidade e clientes',
    destaque: true,
    cta: 'Assinar Pro',
    href: '/cadastro',
    recursos: [
      { label: '1 passeio cadastrado', incluso: true },
      { label: 'Página de perfil pública', incluso: true },
      { label: 'Botão WhatsApp no perfil', incluso: true },
      { label: 'Botão WhatsApp em destaque', incluso: true },
      { label: 'Até 3 passeios', incluso: true },
      { label: 'Até 7 passeios', incluso: false },
      { label: 'Destaque na página inicial', incluso: false },
      { label: 'Selo Guia Verificado', incluso: false },
      { label: 'Posição prioritária na busca', incluso: false },
    ],
  },
  {
    id: 'premium',
    nome: 'Premium',
    preco: 'R$ 49',
    periodo: 'por mês',
    descricao: 'Máxima visibilidade e credibilidade para guias experientes',
    destaque: false,
    cta: 'Assinar Premium',
    href: '/cadastro',
    recursos: [
      { label: '1 passeio cadastrado', incluso: true },
      { label: 'Página de perfil pública', incluso: true },
      { label: 'Botão WhatsApp no perfil', incluso: true },
      { label: 'Botão WhatsApp em destaque', incluso: true },
      { label: 'Até 3 passeios', incluso: true },
      { label: 'Até 7 passeios', incluso: true },
      { label: 'Destaque na página inicial', incluso: true },
      { label: 'Selo Guia Verificado', incluso: true },
      { label: 'Posição prioritária na busca', incluso: true },
    ],
  },
]

export default async function PlanosPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar isLoggedIn={!!user} />

      <main className="flex-1 bg-gray-50">
        {/* Header */}
        <section className="bg-white py-16 px-4 text-center border-b">
          <div className="max-w-2xl mx-auto space-y-4">
            <h1 className="text-4xl font-bold text-gray-900">Planos para guias</h1>
            <p className="text-lg text-gray-500">
              Comece grátis e faça upgrade quando quiser mais visibilidade na Chapada.
            </p>
          </div>
        </section>

        {/* Cards de planos */}
        <section className="py-14 px-4">
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
            {PLANOS.map((plano) => (
              <div
                key={plano.id}
                className={`relative bg-white rounded-2xl border-2 p-6 flex flex-col gap-6 shadow-sm ${
                  plano.destaque
                    ? 'border-green-600 shadow-green-100 shadow-lg'
                    : 'border-gray-200'
                }`}
              >
                {plano.destaque && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <span className="inline-flex items-center gap-1 bg-green-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                      <Star className="h-3 w-3 fill-white" />
                      Mais popular
                    </span>
                  </div>
                )}

                {/* Cabeçalho */}
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{plano.nome}</h2>
                  <p className="text-sm text-gray-500 mt-1">{plano.descricao}</p>
                  <div className="mt-4 flex items-end gap-1">
                    <span className="text-4xl font-extrabold text-gray-900">{plano.preco}</span>
                    <span className="text-gray-400 text-sm mb-1">/{plano.periodo}</span>
                  </div>
                </div>

                {/* CTA */}
                <Link href={user ? '/painel/plano' : plano.href}>
                  <Button
                    className={`w-full ${
                      plano.destaque
                        ? 'bg-green-700 hover:bg-green-800 text-white'
                        : 'bg-gray-900 hover:bg-gray-800 text-white'
                    }`}
                  >
                    {plano.cta}
                  </Button>
                </Link>

                {/* Recursos */}
                <ul className="space-y-2.5">
                  {plano.recursos.map((r) => (
                    <li key={r.label} className="flex items-center gap-2 text-sm">
                      {r.incluso ? (
                        <Check className="h-4 w-4 text-green-600 flex-shrink-0" />
                      ) : (
                        <X className="h-4 w-4 text-gray-300 flex-shrink-0" />
                      )}
                      <span className={r.incluso ? 'text-gray-700' : 'text-gray-400'}>
                        {r.label}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="py-10 px-4 max-w-2xl mx-auto space-y-5 pb-16">
          <h2 className="text-xl font-bold text-gray-900 text-center">Dúvidas frequentes</h2>
          {[
            {
              q: 'Como faço o upgrade de plano?',
              r: 'Entre no seu painel, vá em "Meu Plano" e escolha o plano desejado. O pagamento é feito via PIX.',
            },
            {
              q: 'Posso cancelar quando quiser?',
              r: 'Sim. Você pode cancelar a qualquer momento sem multa. O plano continua ativo até o fim do período pago.',
            },
            {
              q: 'O Selo Verificado é automático?',
              r: 'Não. Após assinar o Premium, nossa equipe valida suas credenciais de guia e ativa o selo manualmente.',
            },
            {
              q: 'O plano Grátis expira?',
              r: 'Não. O plano Grátis é permanente — você pode usar por quanto tempo quiser.',
            },
          ].map(({ q, r }) => (
            <div key={q} className="border-b border-gray-200 pb-4">
              <p className="font-semibold text-gray-800">{q}</p>
              <p className="text-gray-500 text-sm mt-1">{r}</p>
            </div>
          ))}
        </section>
      </main>
    </div>
  )
}
