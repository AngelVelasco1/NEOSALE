import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { nanoid } from 'nanoid';
import { sendVerificationEmail } from '@/lib/verifyEmail';

// MIGRATED: Removed export const runtime = 'nodejs' (incompatible with Cache Components - nodejs is default)

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email es requerido' },
        { status: 400 }
      );
    }

    // Verificar que el usuario existe
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      );
    }

    // Si ya está verificado, no hacer nada
    if (user.emailVerified) {
      return NextResponse.json(
        { message: 'El email ya está verificado' },
        { status: 200 }
      );
    }

    try {
      // Verificar si ya existe un token válido (no expirado)
      const existingValidToken = await prisma.verificationToken.findFirst({
        where: {
          identifier: email,
          expires: {
            gt: new Date(), // Mayor que ahora (no expirado)
          },
        },
        orderBy: {
          expires: 'desc',
        },
      });

      // Si ya existe un token válido, solo reenviar el email
      if (existingValidToken) {
        await sendVerificationEmail({
          email,
          token: existingValidToken.token,
          name: user.name || 'Usuario',
        });

        return NextResponse.json(
          { message: 'Email de verificación reenviado' },
          { status: 200 }
        );
      }

      // Si no existe token válido, eliminar todos los anteriores y crear uno nuevo
      await prisma.verificationToken.deleteMany({
        where: { identifier: email },
      });

      // Crear nuevo token
      const token = nanoid();

      await prisma.verificationToken.create({
        data: {
          identifier: email,
          token,
          expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 horas
        },
      });

      // Enviar email
      await sendVerificationEmail({
        email,
        token,
        name: user.name || 'Usuario',
      });


      return NextResponse.json(
        { message: 'Email de verificación enviado' },
        { status: 200 }
      );
    } catch (tokenError: any) {
      
      // Intentar enviar respuesta exitosa aunque falle (para no bloquear UX)
      return NextResponse.json(
        { message: 'Solicitud procesada' },
        { status: 200 }
      );
    }
  } catch (error) {
    console.error('❌ Error sending verification email:', error);
    return NextResponse.json(
      { error: 'Error al enviar email de verificación' },
      { status: 500 }
    );
  }
}
