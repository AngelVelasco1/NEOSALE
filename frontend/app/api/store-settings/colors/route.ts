import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const settings = await prisma.storeSettings.findFirst({
      where: { active: true },
      select: {
        primary_color: true,
        secondary_color: true,
        accent_color: true,
      },
    });

    return NextResponse.json(
      {
        primary_color: settings?.primary_color || '#3b82f6',
        secondary_color: settings?.secondary_color || '#0ea5e9',
        accent_color: settings?.accent_color || '#d946ef',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching colors:', error);
    return NextResponse.json(
      {
        primary_color: '#3b82f6',
        secondary_color: '#0ea5e9',
        accent_color: '#d946ef',
      },
      { status: 200 }
    );
  }
}
