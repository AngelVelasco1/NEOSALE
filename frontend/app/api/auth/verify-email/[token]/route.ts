import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// MIGRATED: Removed export const runtime = 'nodejs' (incompatible with Cache Components - nodejs is default)

export async function GET(
  request: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;

    // Buscar el token de verificación usando findFirst ya que token no es clave única
    const verificationToken = await prisma.verificationToken.findFirst({
      where: { token },
    });

    if (!verificationToken) {
      return NextResponse.redirect(
        new URL('/login?error=token_invalido', request.url)
      );
    }

    // Verificar si el token ha expirado
    if (new Date() > verificationToken.expires) {
      // Eliminar el token expirado usando la clave compuesta
      await prisma.verificationToken.delete({
        where: { 
          identifier_token: {
            identifier: verificationToken.identifier,
            token: verificationToken.token,
          }
        },
      });

      return NextResponse.redirect(
        new URL('/login?error=token_expirado', request.url)
      );
    }

    // Buscar el usuario por email
    const user = await prisma.user.findUnique({
      where: { email: verificationToken.identifier },
    });

    if (!user) {
      return NextResponse.redirect(
        new URL('/login?error=usuario_no_encontrado', request.url)
      );
    }

    // Actualizar el usuario como verificado
    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: new Date(),
      },
    });

    // Eliminar el token usado con clave compuesta
    await prisma.verificationToken.delete({
      where: { 
        identifier_token: {
          identifier: verificationToken.identifier,
          token: verificationToken.token,
        }
      },
    });

    // Redirigir al login con mensaje de éxito
    return NextResponse.redirect(
      new URL('/login?verified=success', request.url)
    );
  } catch (error) {
    console.error('❌ Error verifying email:', error);
    return NextResponse.redirect(
      new URL('/login?error=error_verificacion', request.url)
    );
  }
}
