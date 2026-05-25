'use client'

import { useActionState } from 'react'
import Link from 'next/link'
import { signUp } from '@/app/actions/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Mountain } from 'lucide-react'

const CIDADES = ['Lençóis', 'Mucugê', 'Andaraí', 'Palmeiras', 'Igatu', 'Ibicoara', 'Outra']

export default function CadastroPage() {
  const [state, action, pending] = useActionState(signUp, null)

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50 py-10">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-2 font-bold text-green-700 text-xl">
            <Mountain className="h-6 w-6" />
            Guia Minha Chapada
          </Link>
          <p className="text-sm text-gray-500 mt-1">Comece grátis — sem cartão de crédito</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Criar conta de guia</CardTitle>
            <CardDescription>Preencha seus dados para começar</CardDescription>
          </CardHeader>
          <CardContent>
            <form action={action} className="space-y-4">
              <div className="space-y-1">
                <Label htmlFor="name">Seu nome completo</Label>
                <Input id="name" name="name" required placeholder="João da Silva" />
              </div>

              <div className="space-y-1">
                <Label htmlFor="city">Cidade onde atua</Label>
                <select
                  id="city"
                  name="city"
                  required
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                  <option value="">Selecione sua cidade</option>
                  {CIDADES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <Label htmlFor="email">E-mail</Label>
                <Input id="email" name="email" type="email" required placeholder="seu@email.com" />
              </div>

              <div className="space-y-1">
                <Label htmlFor="password">Senha</Label>
                <Input id="password" name="password" type="password" required placeholder="mínimo 6 caracteres" minLength={6} />
              </div>

              {state?.error && (
                <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded p-2">
                  {state.error}
                </p>
              )}

              <Button type="submit" disabled={pending} className="w-full bg-green-700 hover:bg-green-800">
                {pending ? 'Criando conta...' : 'Criar conta grátis'}
              </Button>
            </form>

            <p className="text-center text-sm text-gray-500 mt-4">
              Já tem conta?{' '}
              <Link href="/entrar" className="text-green-700 font-medium hover:underline">
                Entrar
              </Link>
            </p>
          </CardContent>
        </Card>

        <div className="text-center text-xs text-gray-400 space-y-1">
          <p>Plano Grátis: 1 passeio, sem custo</p>
          <p>Upgrade para Pro (R$ 29/mês) ou Premium (R$ 49/mês) quando quiser</p>
        </div>
      </div>
    </div>
  )
}
