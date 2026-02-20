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
    // Silently ignore - BD might not be available yet
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
    // Silently ignore - BD might not be available yet
    return 0
  }
}

/**
 * Ejecuta todas las tareas de limpieza de tokens
 * NO bloquea si hay errores de conexión
 */
export async function cleanupAllExpiredTokens(): Promise<void> {
  try {
    await cleanupExpiredVerificationTokens();
    await cleanupExpiredOAuthTokens();
  } catch (error) {
    // Log pero no throw - permite que el servidor inicie aunque falle la BD
    console.debug('Token cleanup encountered an error (not critical):', (error as Error).message)
  }
}

export function startTokenCleanupInterval(intervalMs: number = 60 * 60 * 1000): () => void {
  
  // Fire cleanup asynchronously - NEVER bloquea el servidor
  Promise.resolve().then(() => {
    cleanupAllExpiredTokens()
  }).catch(() => {
    // Ignore all errors - server starts anyway
  })

  // Schedule regular cleanup
  const intervalId = setInterval(() => {
    cleanupAllExpiredTokens().catch(() => {
      // Ignore errors
    })
  }, intervalMs)

  // Retornar función para detener el intervalo
  return () => {
    clearInterval(intervalId)
  };
}
