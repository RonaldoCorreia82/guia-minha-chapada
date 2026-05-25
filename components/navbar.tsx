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
        <Link href="/" className="flex items-center gap-2 font-bold text-green-700 shrink-0">
          <Mountain className="h-6 w-6 shrink-0" />
          <span className="hidden sm:inline text-lg">Guia Minha Chapada</span>
          <span className="sm:hidden text-base">GMC</span>
        </Link>

        <nav className="flex items-center gap-1 sm:gap-3">
          <Link href="/guias">
            <Button variant="ghost" size="sm" className="px-2 sm:px-3">Guias</Button>
          </Link>
          <Link href="/planos">
            <Button variant="ghost" size="sm" className="px-2 sm:px-3">Planos</Button>
          </Link>

          {isLoggedIn ? (
            <>
              {!isPainel && (
                <Link href="/painel">
                  <Button variant="ghost" size="sm" className="px-2 sm:px-3">
                    <span className="hidden sm:inline">Meu Painel</span>
                    <span className="sm:hidden">Painel</span>
                  </Button>
                </Link>
              )}
              <form action={signOut}>
                <Button variant="outline" size="sm" type="submit" className="px-2 sm:px-3">Sair</Button>
              </form>
            </>
          ) : (
            <>
              <Link href="/entrar">
                <Button variant="ghost" size="sm" className="px-2 sm:px-3">Entrar</Button>
              </Link>
              <Link href="/cadastro">
                <Button size="sm" className="bg-green-700 hover:bg-green-800 text-white px-2 sm:px-3">
                  <span className="hidden sm:inline">Sou guia</span>
                  <span className="sm:hidden">Cadastro</span>
                </Button>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}
