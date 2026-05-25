import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { MapPin, ShieldCheck } from 'lucide-react'
import type { Profile } from '@/types'

interface GuiaCardProps {
  guide: Profile
}

export function GuiaCard({ guide }: GuiaCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <CardContent className="p-0">
        <div className="flex flex-col sm:flex-row">
          <div className="w-full sm:w-32 h-32 bg-green-100 flex items-center justify-center flex-shrink-0">
            {guide.photo_url ? (
              <Image
                src={guide.photo_url}
                alt={guide.name}
                width={128}
                height={128}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-4xl font-bold text-green-700">
                {guide.name.charAt(0).toUpperCase()}
              </span>
            )}
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

            <div className="mt-auto pt-2">
              <Link href={`/guias/${guide.slug}`}>
                <Button size="sm" variant="outline" className="border-green-700 text-green-700 hover:bg-green-50">
                  Ver perfil
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
