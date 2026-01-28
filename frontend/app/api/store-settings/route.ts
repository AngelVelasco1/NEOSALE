import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - Obtener configuración de la tienda
export async function GET() {
  try {
    let settings = await prisma.storeSettings.findFirst({
      where: { active: true },
    });

    // Si no existe configuración, crear una por defecto
    if (!settings) {
      settings = await prisma.storeSettings.create({
        data: {
          store_name: 'NeoSale',
          store_description: 'Tu destino premium de moda y estilo en línea',
          contact_email: 'info@neosale.com',
          contact_phone: '+57 300 123 4567',
          city: 'Bogotá',
          country: 'Colombia',
          primary_color: '#3B82F6',
          secondary_color: '#6366F1',
          active: true,
        },
      });
    }

    return NextResponse.json(settings, { status: 200 });
  } catch (error) {
    console.error('Error fetching store settings:', error);
    return NextResponse.json(
      { error: 'Error al obtener la configuración de la tienda' },
      { status: 500 }
    );
  }
}

// PUT - Actualizar configuración de la tienda
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Buscar configuración existente
    let settings = await prisma.storeSettings.findFirst({
      where: { active: true },
    });

    if (settings) {
      // Actualizar configuración existente
      settings = await prisma.storeSettings.update({
        where: { id: settings.id },
        data: {
          ...body,
          updated_at: new Date(),
        },
      });
    } else {
      // Crear nueva configuración
      settings = await prisma.storeSettings.create({
        data: {
          ...body,
          active: true,
        },
      });
    }

    return NextResponse.json(settings, { status: 200 });
  } catch (error) {
    console.error('Error updating store settings:', error);
    return NextResponse.json(
      { error: 'Error al actualizar la configuración de la tienda' },
      { status: 500 }
    );
  }
}
