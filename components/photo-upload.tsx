'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'
import { Camera, Loader2 } from 'lucide-react'

interface PhotoUploadProps {
  userId: string
  currentPhotoUrl: string | null
  name: string
  onUpload: (url: string) => void
}

export function PhotoUpload({ userId, currentPhotoUrl, name, onUpload }: PhotoUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState(currentPhotoUrl)
  const [erro, setErro] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setErro(null)

    if (!file.type.startsWith('image/')) {
      setErro('Selecione um arquivo de imagem (JPG, PNG, etc.)')
      return
    }
    if (file.size > 2 * 1024 * 1024) {
      setErro('A imagem deve ter no máximo 2MB.')
      return
    }

    setUploading(true)
    const supabase = createClient()
    const ext = file.name.split('.').pop()
    const path = `${userId}/avatar.${ext}`

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(path, file, { upsert: true, contentType: file.type })

    if (uploadError) {
      setErro('Erro ao enviar imagem: ' + uploadError.message)
      setUploading(false)
      return
    }

    const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(path)

    const { error: updateError } = await supabase
      .from('profiles')
      .update({ photo_url: publicUrl })
      .eq('id', userId)

    if (updateError) {
      setErro('Erro ao salvar foto no perfil.')
    } else {
      setPreview(publicUrl)
      onUpload(publicUrl)
    }

    setUploading(false)
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className="relative w-24 h-24 rounded-full bg-green-100 flex items-center justify-center overflow-hidden group border-2 border-green-200 hover:border-green-500 transition-colors"
      >
        {preview ? (
          <Image src={preview} alt="Foto de perfil" fill className="object-cover" sizes="96px" />
        ) : (
          <span className="text-3xl font-bold text-green-700">
            {name.charAt(0).toUpperCase()}
          </span>
        )}

        {uploading ? (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-full">
            <Loader2 className="h-6 w-6 text-white animate-spin" />
          </div>
        ) : (
          <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-full">
            <Camera className="h-5 w-5 text-white" />
            <span className="text-white text-[10px] mt-1">Alterar</span>
          </div>
        )}
      </button>

      <p className="text-xs text-gray-400">Clique para enviar foto · máx. 2MB</p>

      {erro && (
        <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded px-2 py-1 text-center max-w-xs">
          {erro}
        </p>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  )
}
