'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { signOut } from '@/app/actions/auth'
import { Mountain } from 'lucide-react'

interface NavbarProps {
  isLoggedIn?: boolean
}

export function Navbar({ isLoggedIn }: NavbarProps) {
  const pathname = usePathname()
  const isPainel = pathname.startsWith('/painel')

  return (
    <header className="border-b bg-white sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-green-700 text-lg">
          <Mountain className="h-6 w-6" />
          Guia Minha Chapada
        </Link>

        <nav className="flex items-center gap-3">
          <Link href="/guias">
            <Button variant="ghost" size="sm">Guias</Button>
          </Link>

          {isLoggedIn ? (
            <>
              {!isPainel && (
                <Link href="/painel">
                  <Button variant="ghost" size="sm">Meu Painel</Button>
                </Link>
              )}
              <form action={signOut}>
                <Button variant="outline" size="sm" type="submit">Sair</Button>
              </form>
            </>
          ) : (
            <>
              <Link href="/entrar">
                <Button variant="ghost" size="sm">Entrar</Button>
              </Link>
              <Link href="/cadastro">
                <Button size="sm" className="bg-green-700 hover:bg-green-800 text-white">
                  Sou guia
                </Button>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}
