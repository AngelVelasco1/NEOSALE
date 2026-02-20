import { NextResponse } from "next/server";
import { cacheLife } from "next/dist/server/use-cache/cache-life";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || (process.env.NODE_ENV === 'production' ? '' : 'http://localhost:8000');

export async function GET() {
  'use cache';
  cacheLife({ stale: 300, revalidate: 600, expire: 3600 });
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
