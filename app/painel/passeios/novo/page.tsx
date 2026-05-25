'use client'

import { useActionState } from 'react'
import { createPasseio } from '@/app/actions/passeios'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function NovoPasseioPage() {
  const [state, action, pending] = useActionState(createPasseio, null)

  return (
    <div className="max-w-xl space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/painel/passeios">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Voltar
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Novo Passeio</h1>
          <p className="text-gray-500 text-sm">Preencha os detalhes do passeio</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Detalhes do passeio</CardTitle>
          <CardDescription>Seja descritivo — turistas decidem pelo que leem aqui</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={action} className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="title">Nome do passeio *</Label>
              <Input id="title" name="title" required placeholder="Ex: Trilha do Pai Inácio com pôr do sol" />
            </div>

            <div className="space-y-1">
              <Label htmlFor="category">Categoria *</Label>
              <select
                id="category"
                name="category"
                required
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                <option value="">Selecione a categoria</option>
                <option value="trilhas">Trilhas</option>
                <option value="cachoeiras">Cachoeiras</option>
                <option value="canions">Cânions</option>
                <option value="travessias">Travessias</option>
              </select>
            </div>

            <div className="space-y-1">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                name="description"
                rows={4}
                placeholder="Descreva o passeio: pontos visitados, distância, o que ver, dicas..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label htmlFor="price_estimate">Valor estimado</Label>
                <Input id="price_estimate" name="price_estimate" placeholder="Ex: R$ 120 por pessoa" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="duration">Duração</Label>
                <Input id="duration" name="duration" placeholder="Ex: 6 horas" />
              </div>
            </div>

            <div className="space-y-1">
              <Label htmlFor="difficulty">Dificuldade</Label>
              <select
                id="difficulty"
                name="difficulty"
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                <option value="">Não informar</option>
                <option value="facil">Fácil</option>
                <option value="moderado">Moderado</option>
                <option value="dificil">Difícil</option>
              </select>
            </div>

            {state?.error && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded p-2">{state.error}</p>
            )}

            <Button type="submit" disabled={pending} className="w-full bg-green-700 hover:bg-green-800">
              {pending ? 'Salvando...' : 'Publicar passeio'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
