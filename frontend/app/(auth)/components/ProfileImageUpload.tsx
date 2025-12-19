"use client"

import React, { useState, useRef } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Camera, Loader2, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { uploadProfileImage, updateUserImage } from "../services/api"
import { useSession } from "next-auth/react"

interface ProfileImageUploadProps {
  userId: number
  currentImage?: string
  userName?: string
  onImageUpdate: () => void
}

export function ProfileImageUpload({ userId, currentImage, userName, onImageUpdate }: ProfileImageUploadProps) {
  const [isHovering, setIsHovering] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { update } = useSession()

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validar tipo de archivo
    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"]
    if (!validTypes.includes(file.type)) {
      alert("Por favor selecciona un archivo de imagen válido (JPEG, PNG, WebP)")
      return
    }

    // Validar tamaño (máximo 5MB)
    const maxSize = 5 * 1024 * 1024
    if (file.size > maxSize) {
      alert("El archivo es demasiado grande. Tamaño máximo: 5MB")
      return
    }

    // Mostrar preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setPreviewImage(reader.result as string)
    }
    reader.readAsDataURL(file)

    // Subir imagen
    setIsUploading(true)
    try {
      const response = await uploadProfileImage(file)
      if (response.success && response.data?.url) {
        await updateUserImage(userId, response.data.url)
        // Update session
        await update({ image: response.data.url })
        onImageUpdate()
        setPreviewImage(null)
      }
    } catch (error) {
      console.error("Error al subir la imagen:", error)
      alert("Error al subir la imagen. Por favor intenta de nuevo.")
      setPreviewImage(null)
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  const handleCancelPreview = () => {
    setPreviewImage(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const displayImage = previewImage || currentImage

  return (
    <div className="relative flex justify-center">
      <div
        className="relative group cursor-pointer"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <div className="relative">
          {/* Glow effect behind avatar */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-700/40 via-blue-900/40 to-slate-900/50 blur-2xl opacity-70 group-hover:opacity-100 transition-opacity duration-500 rounded-full scale-110"></div>
          
          {/* Gradient border ring */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-600 via-blue-900 to-slate-800 p-[3px] shadow-xl shadow-blue-900/30">
            <div className="w-full h-full rounded-full bg-slate-900"></div>
          </div>

          {/* Avatar */}
          <Avatar className="relative w-32 h-32 shadow-2xl bg-gradient-to-br from-blue-700 via-blue-800 to-slate-900 rounded-full">
            {isUploading ? (
              <div className="w-full h-full flex items-center justify-center bg-slate-900/80 backdrop-blur-sm">
                <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
              </div>
            ) : (
              <>
                <AvatarImage 
                  src={displayImage || ""} 
                  alt={userName || ""} 
                  className="rounded-full object-cover" 
                />
                <AvatarFallback className="text-white text-3xl font-bold bg-transparent rounded-full">
                  {getInitials(userName || "Usuario")}
                </AvatarFallback>
              </>
            )}
          </Avatar>

          {/* Overlay on hover */}
          <AnimatePresence>
            {isHovering && !isUploading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 rounded-full bg-slate-900/70 backdrop-blur-sm flex items-center justify-center"
              >
                <p className="text-white text-xs font-semibold">Cambiar foto</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Camera icon button */}
        <motion.button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="absolute -bottom-1 -right-1 w-10 h-10 bg-gradient-to-br from-blue-700 via-blue-800 to-slate-900 rounded-full flex items-center justify-center shadow-xl shadow-blue-900/40 border-2 border-slate-900 disabled:opacity-50 disabled:cursor-not-allowed"
          whileHover={!isUploading ? { scale: 1.15, rotate: 5 } : {}}
          whileTap={!isUploading ? { scale: 0.95 } : {}}
          animate={isHovering && !isUploading ? { scale: 1.1 } : { scale: 1 }}
        >
          {isUploading ? (
            <Loader2 className="w-4 h-4 text-white animate-spin" />
          ) : (
            <Camera className="w-4 h-4 text-white" />
          )}
        </motion.button>

        {/* Cancel preview button */}
        {previewImage && !isUploading && (
          <motion.button
            type="button"
            onClick={handleCancelPreview}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="absolute -top-1 -right-1 w-7 h-7 bg-red-600 hover:bg-red-500 rounded-full flex items-center justify-center shadow-lg border-2 border-slate-900 z-10"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <X className="w-3 h-3 text-white" />
          </motion.button>
        )}

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp"
          onChange={handleFileSelect}
          className="hidden"
          disabled={isUploading}
        />
      </div>
    </div>
  )
}
