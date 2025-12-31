"use client";

import { useState } from "react";
import { Mail, X, RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { toast } from "sonner";
import { useUserSafe } from "../(auth)/hooks/useUserSafe";

export function EmailVerificationBanner() {
  const { userProfile } = useUserSafe();
  const [isDismissed, setIsDismissed] = useState(false);
  const [isResending, setIsResending] = useState(false);

  // No mostrar si: sesión no cargada, usuario verificado, o banner cerrado
  if (!userProfile || userProfile.email_verified || isDismissed) {
    return null;
  }

  const handleResendEmail = async () => {
    setIsResending(true);
    try {
      await axios.post('/api/auth/send-verification', {
        email: userProfile.email,
      });
      
      toast.success('Email enviado', {
        description: 'Revisa tu bandeja de entrada',
      });
    } catch (error) {
      toast.error('Error al enviar email', {
        description: 'Inténtalo de nuevo más tarde',
      });
      console.error('Error resending email:', error);
    } finally {
      setIsResending(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -100 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -100 }}
        className="fixed top-0 left-0 right-0 z-50 bg-linear-to-r from-amber-500 via-orange-500 to-amber-500 shadow-lg"
      >
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 flex-1">
              <div className="bg-white/20 p-2 rounded-full">
                <Mail className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-white font-semibold text-sm md:text-base">
                  Verifica tu correo electrónico
                </p>
                <p className="text-white/90 text-xs md:text-sm">
                  Te enviamos un enlace de verificación a{" "}
                  <span className="font-semibold">{userProfile.email}</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleResendEmail}
                disabled={isResending}
                className="flex items-center gap-2 px-4 py-2 bg-white text-orange-600 rounded-lg hover:bg-white/90 transition-colors font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isResending ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  <>
                    <Mail className="w-4 h-4" />
                    Reenviar
                  </>
                )}
              </button>

              <button
                onClick={() => setIsDismissed(true)}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                aria-label="Cerrar banner"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
