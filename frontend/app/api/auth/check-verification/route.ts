import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email requerido' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        email: true,
        email_verified: true,
      },
    });

    if (!user) {
      return NextResponse.json({ 
        exists: false,
        verified: false 
      });
    }

    return NextResponse.json({ 
      exists: true,
      verified: !!user.email_verified 
    });
  } catch (error) {
    console.error('Error checking email verification:', error);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}
