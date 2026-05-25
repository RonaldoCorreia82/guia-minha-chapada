import { createClient } from '@/lib/supabase/server'
import { Navbar } from '@/components/navbar'
import { PasseioCard } from '@/components/passeio-card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { MapPin, MessageCircle, ShieldCheck, Globe, Star } from 'lucide-react'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import type { Passeio, Profile } from '@/types'

interface Props {
  params: Promise<{ slug: string }>
}

export default async function PerfilGuiaPage({ params }: Props) {
  const { slug } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: guide } = await supabase
    .from('profiles')
    .select('*')
    .eq('slug', slug)
    .single()

  if (!guide) notFound()

  const { data: passeios } = await supabase
    .from('passeios')
    .select('*')
    .eq('guide_id', guide.id)
    .eq('active', true)
    .order('created_at', { ascending: false })

  const whatsappLink = guide.whatsapp
    ? `https://wa.me/55${guide.whatsapp.replace(/\D/g, '')}?text=Olá ${encodeURIComponent(guide.name)}! Encontrei seu perfil no Guia Minha Chapada e gostaria de saber mais sobre seus passeios.`
    : null

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar isLoggedIn={!!user} />

      <main className="flex-1 max-w-4xl mx-auto px-4 py-10 w-full">
        {/* Header do perfil */}
        <div className="flex flex-col sm:flex-row gap-6 items-start mb-10">
          <div className="w-28 h-28 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
            {(guide as Profile).photo_url ? (
              <Image
                src={(guide as Profile).photo_url!}
                alt={guide.name}
                width={112}
                height={112}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-5xl font-bold text-green-700">
                {guide.name.charAt(0).toUpperCase()}
              </span>
            )}
          </div>

          <div className="flex-1 space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-bold text-gray-900">{guide.name}</h1>
              {guide.verified && (
                <div className="flex items-center gap-1 text-green-600">
                  <ShieldCheck className="h-5 w-5" />
                  <span className="text-sm font-medium">Guia Verificado</span>
                </div>
              )}
              {guide.plan === 'premium' && (
                <Badge className="bg-amber-100 text-amber-800 border-amber-200">Premium</Badge>
              )}
            </div>

            <div className="flex items-center gap-1 text-gray-500">
              <MapPin className="h-4 w-4" />
              <span>{guide.city}, Bahia</span>
            </div>

            {guide.bio && (
              <p className="text-gray-600 leading-relaxed max-w-xl">{guide.bio}</p>
            )}

            {/* Idiomas */}
            {(guide.lang_pt || guide.lang_en || guide.lang_es) && (
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <div className="flex items-center gap-1 text-gray-500 text-sm">
                  <Globe className="h-4 w-4" />
                  <span>Atende em:</span>
                </div>
                {guide.lang_pt && <Badge variant="outline" className="text-xs border-green-300 text-green-700">🇧🇷 Português</Badge>}
                {guide.lang_en && <Badge variant="outline" className="text-xs border-blue-300 text-blue-700">🇺🇸 Inglês</Badge>}
                {guide.lang_es && <Badge variant="outline" className="text-xs border-orange-300 text-orange-700">🇪🇸 Espanhol</Badge>}
              </div>
            )}

            {/* Diferenciais */}
            {(guide.feat_dicas || guide.feat_personalizado || guide.feat_familias || guide.feat_24h || guide.feat_cadastur) && (
              <div className="flex flex-wrap gap-2 pt-1">
                {guide.feat_dicas         && <Badge className="bg-green-50 text-green-800 border border-green-200 text-xs font-normal"><Star className="h-3 w-3 mr-1" />Dicas locais</Badge>}
                {guide.feat_personalizado && <Badge className="bg-green-50 text-green-800 border border-green-200 text-xs font-normal"><Star className="h-3 w-3 mr-1" />Passeios personalizados</Badge>}
                {guide.feat_familias      && <Badge className="bg-green-50 text-green-800 border border-green-200 text-xs font-normal"><Star className="h-3 w-3 mr-1" />Famílias e grupos</Badge>}
                {guide.feat_24h           && <Badge className="bg-green-50 text-green-800 border border-green-200 text-xs font-normal"><Star className="h-3 w-3 mr-1" />Atendimento 24h</Badge>}
                {guide.feat_cadastur      && <Badge className="bg-amber-50 text-amber-800 border border-amber-200 text-xs font-normal"><ShieldCheck className="h-3 w-3 mr-1" />CadasTur</Badge>}
              </div>
            )}

            {whatsappLink ? (
              <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                <Button className="bg-green-600 hover:bg-green-700 text-white mt-2">
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Falar no WhatsApp
                </Button>
              </a>
            ) : (
              <p className="text-sm text-gray-400 italic">WhatsApp não informado</p>
            )}
          </div>
        </div>

        {/* Passeios */}
        <div>
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Passeios disponíveis
            <span className="text-sm font-normal text-gray-500 ml-2">({passeios?.length ?? 0})</span>
          </h2>

          {passeios && passeios.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {(passeios as Passeio[]).map((passeio) => (
                <PasseioCard key={passeio.id} passeio={passeio} />
              ))}
            </div>
          ) : (
            <p className="text-gray-500">Este guia ainda não cadastrou passeios.</p>
          )}
        </div>

        {/* CTA de contato */}
        {whatsappLink && (
          <div className="mt-10 p-6 bg-green-50 border border-green-200 rounded-xl text-center space-y-3">
            <p className="font-semibold text-gray-800">Interessado em um passeio com {guide.name}?</p>
            <p className="text-sm text-gray-500">Entre em contato diretamente pelo WhatsApp para combinar detalhes e confirmar disponibilidade.</p>
            <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
              <Button className="bg-green-600 hover:bg-green-700 text-white">
                <MessageCircle className="mr-2 h-4 w-4" />
                Entrar em contato
              </Button>
            </a>
          </div>
        )}
      </main>
    </div>
  )
}
