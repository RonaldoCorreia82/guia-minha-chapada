import { CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function PagamentoSucessoPage() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
      <CheckCircle2 className="h-16 w-16 text-green-500" />
      <h1 className="text-2xl font-bold text-gray-900">Pagamento confirmado!</h1>
      <p className="text-gray-500 max-w-sm">
        Seu plano foi ativado com sucesso. Em instantes os recursos estarão disponíveis no seu perfil.
      </p>
      <div className="flex gap-3 pt-2">
        <Link href="/painel">
          <Button className="bg-green-700 hover:bg-green-800">Ir para o painel</Button>
        </Link>
        <Link href="/painel/plano">
          <Button variant="outline">Ver meu plano</Button>
        </Link>
      </div>
    </div>
  )
}
