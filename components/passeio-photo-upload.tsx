'use client'

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'
import { ImagePlus, X, Loader2 } from 'lucide-react'

export function PasseioPhotoUpload() {
  const [userId, setUserId] = useState<string | null>(null)
  const [photos, setPhotos]   = useState<(string | null)[]>([null, null, null])
  const [loading, setLoading] = useState<boolean[]>([false, false, false])
  const [errors, setErrors]   = useState<(string | null)[]>([null, null, null])

  const ref0 = useRef<HTMLInputElement>(null)
  const ref1 = useRef<HTMLInputElement>(null)
  const ref2 = useRef<HTMLInputElement>(null)
  const refs = [ref0, ref1, ref2]

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) setUserId(user.id)
    })
  }, [])

  async function handleFile(index: number, file: File) {
    if (!file.type.startsWith('image/')) {
      setErrors(prev => { const e = [...prev]; e[index] = 'Selecione uma imagem.'; return e })
      return
    }
    if (file.size > 3 * 1024 * 1024) {
      setErrors(prev => { const e = [...prev]; e[index] = 'Máximo 3 MB.'; return e })
      return
    }
    if (!userId) return

    setLoading(prev => { const l = [...prev]; l[index] = true; return l })
    setErrors(prev => { const e = [...prev]; e[index] = null; return e })

    const supabase = createClient()
    const ext = file.name.split('.').pop()
    const path = `${userId}/${Date.now()}-${index}.${ext}`

    const { error } = await supabase.storage
      .from('passeios')
      .upload(path, file, { upsert: true })

    if (error) {
      setErrors(prev => { const e = [...prev]; e[index] = 'Erro ao enviar.'; return e })
    } else {
      const { data: { publicUrl } } = supabase.storage.from('passeios').getPublicUrl(path)
      setPhotos(prev => { const p = [...prev]; p[index] = publicUrl; return p })
    }

    setLoading(prev => { const l = [...prev]; l[index] = false; return l })
  }

  function remove(index: number) {
    setPhotos(prev => { const p = [...prev]; p[index] = null; return p })
    const r = refs[index].current
    if (r) r.value = ''
  }

  return (
    <div className="space-y-2">
      <div className="flex gap-3 flex-wrap">
        {([0, 1, 2] as const).map((i) => (
          <div key={i}>
            {/* URL enviada junto com o formulário */}
            <input type="hidden" name={`photo_${i + 1}`} value={photos[i] ?? ''} />

            {photos[i] ? (
              <div className="relative w-24 h-24 rounded-lg overflow-hidden border border-gray-200">
                <Image src={photos[i]!} alt={`Foto ${i + 1}`} fill className="object-cover" />
                <button
                  type="button"
                  onClick={() => remove(i)}
                  className="absolute top-1 right-1 bg-black/60 rounded-full p-0.5 text-white hover:bg-black/80"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => refs[i].current?.click()}
                disabled={loading[i] || !userId}
                className="w-24 h-24 rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center gap-1 text-gray-400 hover:border-green-400 hover:text-green-500 transition-colors disabled:opacity-40"
              >
                {loading[i] ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    <ImagePlus className="h-5 w-5" />
                    <span className="text-xs">Foto {i + 1}</span>
                  </>
                )}
              </button>
            )}

            <input
              ref={refs[i]}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) handleFile(i, file)
              }}
            />

            {errors[i] && (
              <p className="text-xs text-red-500 mt-1 w-24">{errors[i]}</p>
            )}
          </div>
        ))}
      </div>
      <p className="text-xs text-gray-400">Até 3 fotos • Máximo 3 MB cada</p>
    </div>
  )
}
