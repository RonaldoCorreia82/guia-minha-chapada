import { Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function PagamentoPendentePage() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
      <Clock className="h-16 w-16 text-amber-500" />
      <h1 className="text-2xl font-bold text-gray-900">Pagamento em análise</h1>
      <p className="text-gray-500 max-w-sm">
        Seu pagamento está sendo processado. Assim que aprovado, o plano será ativado automaticamente.
        Você receberá uma confirmação do Mercado Pago.
      </p>
      <Link href="/painel">
        <Button className="bg-green-700 hover:bg-green-800">Voltar ao painel</Button>
      </Link>
    </div>
  )
}
