import { NextResponse } from "next/server";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const MIN_QUERY_LENGTH = 2;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const rawQuery = searchParams.get("q") ?? "";
  const normalizedQuery = rawQuery.trim();
  const limit = searchParams.get("limit") ?? "5";

  if (normalizedQuery.length < MIN_QUERY_LENGTH) {
    return NextResponse.json({
      success: true,
      results: {
        products: [],
        categories: [],
        customers: [],
      },
    });
  }

  try {
    const params = new URLSearchParams();
    params.append("q", normalizedQuery);
    params.append("limit", limit);

    const response = await fetch(`${BACKEND_URL}/api/search?${params.toString()}`, {
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
    return NextResponse.json(data);
  } catch (error) {
    
    return NextResponse.json(
      {
        success: false,
        message: "No se pudo completar la búsqueda",
      },
      { status: 500 }
    );
  }
}
