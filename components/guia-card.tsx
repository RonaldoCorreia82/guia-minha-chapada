import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { MapPin, ShieldCheck, MessageCircle } from 'lucide-react'
import type { Profile } from '@/types'

interface GuiaCardProps {
  guide: Profile
}

export function GuiaCard({ guide }: GuiaCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <CardContent className="p-0">
        <div className="flex flex-col sm:flex-row">
          <div className="flex items-center justify-center p-4 sm:p-3 flex-shrink-0">
            <Link href={`/guias/${guide.slug}`}>
              <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center overflow-hidden flex-shrink-0 hover:opacity-80 transition-opacity">
                {guide.photo_url ? (
                  <Image
                    src={guide.photo_url}
                    alt={guide.name}
                    width={96}
                    height={96}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-3xl font-bold text-green-700">
                    {guide.name.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
            </Link>
          </div>

          <div className="p-4 flex flex-col gap-2 flex-1">
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-gray-900">{guide.name}</h3>
                  {guide.verified && (
                    <ShieldCheck className="h-4 w-4 text-green-600" />
                  )}
                </div>
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <MapPin className="h-3 w-3" />
                  {guide.city}
                </div>
              </div>
              {guide.plan === 'premium' && (
                <Badge className="bg-amber-100 text-amber-800 border-amber-200">
                  Verificado
                </Badge>
              )}
            </div>

            {guide.bio && (
              <p className="text-sm text-gray-600 line-clamp-2">{guide.bio}</p>
            )}

            <div className="mt-auto pt-2 flex gap-2 flex-wrap">
              <Link href={`/guias/${guide.slug}`}>
                <Button size="sm" variant="outline" className="border-green-700 text-green-700 hover:bg-green-50">
                  Ver perfil
                </Button>
              </Link>

              {(guide.plan === 'pro' || guide.plan === 'premium') && guide.whatsapp && (
                <a
                  href={`https://wa.me/55${guide.whatsapp.replace(/\D/g, '')}?text=Olá ${encodeURIComponent(guide.name)}! Encontrei seu perfil no Guia Minha Chapada e gostaria de saber mais sobre seus passeios.`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button size="sm" className="bg-green-500 hover:bg-green-600 text-white">
                    <MessageCircle className="h-3.5 w-3.5 mr-1" />
                    WhatsApp
                  </Button>
                </a>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
