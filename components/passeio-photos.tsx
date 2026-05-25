'use client'

import { useState } from 'react'
import Image from 'next/image'
import { X } from 'lucide-react'

interface PasseioPhotosProps {
  photos: string[]
  title: string
}

export function PasseioPhotos({ photos, title }: PasseioPhotosProps) {
  const [open, setOpen] = useState<string | null>(null)

  return (
    <>
      {/* Faixa de fotos */}
      <div className="flex gap-0.5">
        {photos.map((url, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setOpen(url)}
            className="relative flex-1 h-20 overflow-hidden first:rounded-bl-lg last:rounded-br-lg hover:opacity-90 transition-opacity focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500"
          >
            <Image
              src={url}
              alt={`${title} — foto ${i + 1}`}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 33vw, 200px"
            />
          </button>
        ))}
      </div>

      {/* Lightbox */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setOpen(null)}
        >
          <button
            type="button"
            onClick={() => setOpen(null)}
            className="absolute top-4 right-4 bg-white/20 hover:bg-white/40 rounded-full p-2 text-white transition-colors"
            aria-label="Fechar"
          >
            <X className="h-5 w-5" />
          </button>

          <div
            className="relative max-w-3xl w-full max-h-[85vh] aspect-video"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={open}
              alt={title}
              fill
              className="object-contain rounded-lg"
              sizes="(max-width: 768px) 100vw, 768px"
            />
          </div>
        </div>
      )}
    </>
  )
}
