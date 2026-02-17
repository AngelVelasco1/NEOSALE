// Token cleanup using Prisma - fixed after PrismaPg adapter configuration update
import { prisma } from './prisma.js'

/**
 * Elimina tokens de verificación expirados de la base de datos
 * @returns Número de tokens eliminados
 */
export async function cleanupExpiredVerificationTokens(): Promise<number> {
  try {
    const result = await prisma.verificationToken.deleteMany({
      where: {
        expires: {
          lt: new Date()
        }
      }
    })

    return result.count
  } catch (error) {
    console.error('Error limpiando tokens de verificación:', error)
    return 0
  }
}

/**
 * Elimina cuentas OAuth con tokens expirados (opcional)
 * Solo elimina el refreshToken/accessToken, no la cuenta completa
 * @returns Número de cuentas actualizadas
 */
export async function cleanupExpiredOAuthTokens(): Promise<number> {
  try {
    const result = await prisma.account.updateMany({
      where: {
        AND: [
          { expiresAt: { not: null } },
          { 
            expiresAt: { 
              lt: Math.floor(Date.now() / 1000)
            }
          },
          {
            OR: [
              { refreshToken: { not: null } },
              { accessToken: { not: null } }
            ]
          }
        ]
      },
      data: {
        refreshToken: null,
        accessToken: null
      }
    })

    return result.count
  } catch (error) {
    console.error('Error limpiando tokens OAuth:', error)
    return 0
  }
}

/**
 * Ejecuta todas las tareas de limpieza de tokens
 */
export async function cleanupAllExpiredTokens(): Promise<void> {
  await cleanupExpiredVerificationTokens();
  await cleanupExpiredOAuthTokens();

}

export function startTokenCleanupInterval(intervalMs: number = 60 * 60 * 1000): () => void {
  
  // Run cleanup immediately on startup, then at regular intervals
  cleanupAllExpiredTokens().then(() => {
  }).catch(err => {
    console.error('Initial token cleanup failed:', err)
  })

  const intervalId = setInterval(() => {
    cleanupAllExpiredTokens().catch(err => {
      console.error('Token cleanup failed:', err)
    })
  }, intervalMs)


  // Retornar función para detener el intervalo
  return () => {
    clearInterval(intervalId)
  };
}
