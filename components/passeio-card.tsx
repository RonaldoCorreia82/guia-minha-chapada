import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Clock, DollarSign } from 'lucide-react'
import { CATEGORIES, DIFFICULTIES, type Passeio } from '@/types'

interface PasseioCardProps {
  passeio: Passeio
}

const CATEGORY_COLORS = {
  trilhas: 'bg-green-100 text-green-800',
  cachoeiras: 'bg-blue-100 text-blue-800',
  canions: 'bg-orange-100 text-orange-800',
  travessias: 'bg-purple-100 text-purple-800',
}

export function PasseioCard({ passeio }: PasseioCardProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-base">{passeio.title}</CardTitle>
          <Badge className={CATEGORY_COLORS[passeio.category]}>
            {CATEGORIES[passeio.category]}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {passeio.description && (
          <p className="text-sm text-gray-600 line-clamp-3">{passeio.description}</p>
        )}
        <div className="flex flex-wrap gap-3 text-sm text-gray-500">
          {passeio.price_estimate && (
            <span className="flex items-center gap-1">
              <DollarSign className="h-3 w-3" />
              {passeio.price_estimate}
            </span>
          )}
          {passeio.duration && (
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {passeio.duration}
            </span>
          )}
          {passeio.difficulty && (
            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-gray-100">
              {DIFFICULTIES[passeio.difficulty]}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
