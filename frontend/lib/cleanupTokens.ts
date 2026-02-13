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

    if (result.count > 0) {
      console.log(`✅ Limpieza de tokens: ${result.count} token(s) de verificación expirado(s) eliminado(s)`);
    }

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

    if (result.count > 0) {
      console.log(`✅ Limpieza de tokens OAuth: ${result.count} token(s) OAuth expirado(s) limpiado(s)`);
    }

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
  console.log('🧹 Iniciando limpieza de tokens expirados...');
  
  const verificationCount = await cleanupExpiredVerificationTokens();
  const oauthCount = await cleanupExpiredOAuthTokens();

  console.log(`🎉 Limpieza completada: ${verificationCount + oauthCount} token(s) procesado(s) en total`);
}

/**
 * Inicia un intervalo de limpieza automática
 * @param intervalMs Intervalo en milisegundos (default: 1 hora)
 * @returns Función para detener el intervalo
 */
export function startTokenCleanupInterval(intervalMs: number = 60 * 60 * 1000): () => void {
  console.log(`⏰ Iniciando limpieza automática de tokens cada ${intervalMs / 1000 / 60} minutos`);
  
  // Ejecutar inmediatamente al inicio
  cleanupAllExpiredTokens().catch(console.error);

  // Luego ejecutar periódicamente
  const intervalId = setInterval(() => {
    cleanupAllExpiredTokens().catch(console.error);
  }, intervalMs);

  // Retornar función para detener el intervalo
  return () => {
    clearInterval(intervalId);
    console.log('⏸️ Limpieza automática de tokens detenida');
  };
}
