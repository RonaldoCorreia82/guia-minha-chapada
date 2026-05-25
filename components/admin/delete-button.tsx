'use client'

import { Button } from '@/components/ui/button'
import { Trash2 } from 'lucide-react'

interface DeleteButtonProps {
  action: () => Promise<void>
  confirmMessage: string
}

export function DeleteButton({ action, confirmMessage }: DeleteButtonProps) {
  return (
    <form
      action={async () => {
        if (!confirm(confirmMessage)) return
        await action()
      }}
    >
      <Button
        type="submit"
        size="sm"
        variant="ghost"
        className="text-red-500 hover:text-red-700 hover:bg-red-50"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </form>
  )
}
