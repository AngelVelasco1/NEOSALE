import { NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || (process.env.NODE_ENV === 'production' ? '' : 'http://localhost:8000');

export async function GET() {
  try {
    const response = await fetch(`${BACKEND_URL}/api/store-settings/colors`, {
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
      {
        primary_color: '#3b82f6',
        secondary_color: '#0ea5e9',
        accent_color: '#d946ef',
      },
      { status: 200 }
    );
  }
}
