export type Plan = 'free' | 'pro' | 'premium'
export type Category = 'trilhas' | 'cachoeiras' | 'canions' | 'travessias'
export type Difficulty = 'facil' | 'moderado' | 'dificil'

export interface Profile {
  id: string
  name: string
  slug: string
  bio: string | null
  city: string
  whatsapp: string | null
  photo_url: string | null
  plan: Plan
  verified: boolean
  created_at: string
}

export interface Passeio {
  id: string
  guide_id: string
  title: string
  description: string | null
  category: Category
  price_estimate: string | null
  difficulty: Difficulty | null
  duration: string | null
  active: boolean
  created_at: string
}

export const PLAN_LIMITS: Record<Plan, number> = {
  free: 1,
  pro: 3,
  premium: 7,
}

export const PLAN_INFO: Record<Plan, { label: string; price: string; limit: number }> = {
  free: { label: 'Grátis', price: 'R$ 0/mês', limit: 1 },
  pro: { label: 'Pro', price: 'R$ 29/mês', limit: 3 },
  premium: { label: 'Premium', price: 'R$ 49/mês', limit: 7 },
}

export const CATEGORIES: Record<Category, string> = {
  trilhas: 'Trilhas',
  cachoeiras: 'Cachoeiras',
  canions: 'Cânions',
  travessias: 'Travessias',
}

export const DIFFICULTIES: Record<Difficulty, string> = {
  facil: 'Fácil',
  moderado: 'Moderado',
  dificil: 'Difícil',
}
