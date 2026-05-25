import { createClient } from '@/lib/supabase/server'
import { Navbar } from '@/components/navbar'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { LayoutDashboard, User, Map } from 'lucide-react'

export default async function PainelLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/entrar')

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar isLoggedIn />

      <div className="flex-1 flex max-w-6xl mx-auto w-full px-4 py-8 gap-8">
        {/* Sidebar */}
        <aside className="w-48 flex-shrink-0 hidden md:block">
          <nav className="space-y-1">
            {[
              { href: '/painel', icon: LayoutDashboard, label: 'Painel' },
              { href: '/painel/perfil', icon: User, label: 'Meu Perfil' },
              { href: '/painel/passeios', icon: Map, label: 'Passeios' },
            ].map(({ href, icon: Icon, label }) => (
              <Link
                key={href}
                href={href}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-green-50 hover:text-green-700 transition-colors"
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            ))}
          </nav>
        </aside>

        {/* Conteúdo */}
        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </div>
  )
}
