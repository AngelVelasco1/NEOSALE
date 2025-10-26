import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ transactionId: string }> }
) {
  try {
    const { transactionId } = await params;

    if (!transactionId) {
      return NextResponse.json(
        {
          success: false,
          message: "ID de transacción requerido",
        },
        { status: 400 }
      );
    }

    // Hacer petición al backend
    const response = await fetch(
      `${BACKEND_URL}/api/payments/transaction/${transactionId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      console.error("❌ Error del backend:", {
        status: response.status,
        statusText: response.statusText,
        errorData,
      });

      return NextResponse.json(
        {
          success: false,
          message: "Error consultando estado de transacción",
          error:
            errorData?.error ||
            `Error ${response.status}: ${response.statusText}`,
        },
        { status: response.status }
      );
    }

    const result = await response.json();

    console.log("Estado de transacción obtenido:", {
      transactionId,
      status: result.data?.status,
      success: result.success,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("❌ Error en API route de transacción:", error);

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
