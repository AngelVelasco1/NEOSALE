import { NextResponse } from "next/server";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || (process.env.NODE_ENV === 'production' ? '' : 'http://localhost:8000');

export async function GET() {
  try {
    const response = await fetch(`${BACKEND_URL}/api/products/trust-metrics`, {
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
    return NextResponse.json(data.data || data);
  } catch (error) {
    return NextResponse.json({ error: "No se pudieron obtener las métricas" }, { status: 500 });
  }
}
