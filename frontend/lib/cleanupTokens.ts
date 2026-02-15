import { prisma } from './prisma';

/**
 * Elimina tokens de verificación expirados de la base de datos
 * @returns Número de tokens eliminados
 */
export async function cleanupExpiredVerificationTokens(): Promise<number> {
  try {
    const result = await prisma.verificationToken.deleteMany({
      where: {
        expires: {
          lt: new Date(), // Tokens que ya expiraron
        },
      },
    });


    return result.count;
  } catch (error) {
    console.error('❌ Error limpiando tokens de verificación:', error);
    return 0;
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
        expiresAt: {
          not: null,
          lt: Math.floor(Date.now() / 1000), // Unix timestamp en segundos
        },
        OR: [
          { refreshToken: { not: null } },
          { accessToken: { not: null } },
        ],
      },
      data: {
        refreshToken: null,
        accessToken: null,
      },
    });

   

    return result.count;
  } catch (error) {
    console.error('❌ Error limpiando tokens OAuth:', error);
    return 0;
  }
}

/**
 * Ejecuta todas las tareas de limpieza de tokens
 */
export async function cleanupAllExpiredTokens(): Promise<void> {
  
 

}

/**
 * Inicia un intervalo de limpieza automática
 * @param intervalMs Intervalo en milisegundos (default: 1 hora)
 * @returns Función para detener el intervalo
 */
export function startTokenCleanupInterval(intervalMs: number = 60 * 60 * 1000): () => void {
  
  // Ejecutar inmediatamente al inicio
  cleanupAllExpiredTokens().catch(console.error);

  // Luego ejecutar periódicamente
  const intervalId = setInterval(() => {
    cleanupAllExpiredTokens().catch(console.error);
  }, intervalMs);

  // Retornar función para detener el intervalo
  return () => {
    clearInterval(intervalId);
  };
}
