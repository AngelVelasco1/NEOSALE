import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || (process.env.NODE_ENV === 'production' ? '' : 'http://localhost:8000');

// GET - Obtener configuración de la tienda
export async function GET() {
  try {
    const response = await fetch(`${BACKEND_URL}/api/store-settings`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`Backend error: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data.data || data, { status: 200 });
  } catch (error) {
    
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

    const response = await fetch(`${BACKEND_URL}/api/store-settings`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`Backend error: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data.data || data, { status: 200 });
  } catch (error) {
    
    return NextResponse.json(
      { error: 'Error al actualizar la configuración de la tienda' },
      { status: 500 }
    );
  }
}
