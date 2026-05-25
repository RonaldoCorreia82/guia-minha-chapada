'use client'

import { useTransition } from 'react'
import { atualizarPlano } from '@/app/actions/admin'
import type { Plan } from '@/types'

const PLANO_COR: Record<Plan, string> = {
  free: 'text-gray-700 bg-gray-100',
  pro: 'text-blue-700 bg-blue-100',
  premium: 'text-amber-700 bg-amber-100',
}

interface PlanSelectProps {
  guideId: string
  planoAtual: Plan
}

export function PlanSelect({ guideId, planoAtual }: PlanSelectProps) {
  const [pending, startTransition] = useTransition()

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const novoPlan = e.target.value as Plan
    startTransition(() => {
      atualizarPlano(guideId, novoPlan)
    })
  }

  return (
    <select
      key={planoAtual}
      defaultValue={planoAtual}
      onChange={handleChange}
      disabled={pending}
      className={`text-xs font-semibold px-2 py-1 rounded-lg border border-transparent focus:outline-none focus:ring-2 focus:ring-green-500 transition-opacity ${PLANO_COR[planoAtual]} ${pending ? 'opacity-50' : ''}`}
    >
      <option value="free">Grátis</option>
      <option value="pro">Pro — R$ 29/mês</option>
      <option value="premium">Premium — R$ 49/mês</option>
    </select>
  )
}
