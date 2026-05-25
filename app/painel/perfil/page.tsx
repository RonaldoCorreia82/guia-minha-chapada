'use client'

import { useActionState, useEffect, useState } from 'react'
import { updateProfile } from '@/app/actions/profile'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import type { Profile } from '@/types'

const CIDADES = ['Lençóis', 'Mucugê', 'Andaraí', 'Palmeiras', 'Igatu', 'Ibicoara', 'Outra']

export default function PerfilPage() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [state, action, pending] = useActionState(updateProfile, null)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) return
      const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single()
      setProfile(data)
    })
  }, [])

  if (!profile) return <p className="text-gray-400 text-sm">Carregando perfil...</p>

  return (
    <div className="max-w-xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Meu Perfil</h1>
        <p className="text-gray-500 text-sm">Informações visíveis para os turistas</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Dados do perfil</CardTitle>
          <CardDescription>Preencha com cuidado — turistas verão essas informações</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={action} className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="name">Nome completo</Label>
              <Input id="name" name="name" defaultValue={profile.name} required />
            </div>

            <div className="space-y-1">
              <Label htmlFor="city">Cidade onde atua</Label>
              <select
                id="city"
                name="city"
                defaultValue={profile.city}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                {CIDADES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <Label htmlFor="whatsapp">WhatsApp (somente números com DDD)</Label>
              <Input id="whatsapp" name="whatsapp" defaultValue={profile.whatsapp ?? ''} placeholder="75999998888" />
              <p className="text-xs text-gray-400">Ex: 75999998888 (sem parênteses, espaços ou traços)</p>
            </div>

            <div className="space-y-1">
              <Label htmlFor="bio">Sobre você</Label>
              <Textarea
                id="bio"
                name="bio"
                defaultValue={profile.bio ?? ''}
                rows={4}
                placeholder="Conte sua história como guia, experiência, diferenciais..."
              />
            </div>

            {state?.error && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded p-2">{state.error}</p>
            )}
            {state?.success && (
              <p className="text-sm text-green-700 bg-green-50 border border-green-200 rounded p-2">Perfil salvo com sucesso!</p>
            )}

            <Button type="submit" disabled={pending} className="bg-green-700 hover:bg-green-800">
              {pending ? 'Salvando...' : 'Salvar perfil'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
