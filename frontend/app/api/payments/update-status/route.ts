import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { transactionId, status, wompiResponse } = body;

    if (!transactionId || !status) {
      return NextResponse.json(
        {
          success: false,
          message: "transactionId y status son requeridos",
        },
        { status: 400 }
      );
    }

    // Hacer petición al backend para actualizar el estado
    const response = await fetch(`${BACKEND_URL}/api/payments/update-status`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        transactionId,
        status,
        wompiResponse,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      

      return NextResponse.json(
        {
          success: false,
          message: "Error actualizando estado de transacción",
          error:
            errorData?.error ||
            `Error ${response.status}: ${response.statusText}`,
        },
        { status: response.status }
      );
    }

    const result = await response.json();

    return NextResponse.json(result);
  } catch (error) {
    

    return NextResponse.json(
      {
        success: false,
        message: "Error interno del servidor",
        error: error instanceof Error ? error.message : "Error desconocido",
      },
      { status: 500 }
    );
  }
}
