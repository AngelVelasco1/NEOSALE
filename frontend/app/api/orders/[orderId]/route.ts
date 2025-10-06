import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/app/(auth)/auth";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function GET(
  request: NextRequest,
  { params }: { params: { orderId: string } }
) {
  try {
    // Obtener la sesión del usuario
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        {
          success: false,
          message: "Usuario no autenticado",
        },
        { status: 401 }
      );
    }

    const { orderId } = params;

    if (!orderId || isNaN(parseInt(orderId))) {
      return NextResponse.json(
        {
          success: false,
          message: "ID de orden inválido",
        },
        { status: 400 }
      );
    }

    console.log("🔍 Obteniendo orden:", {
      orderId: parseInt(orderId),
      userId: session.user.id,
    });

    // Hacer petición al backend
    const response = await fetch(
      `${BACKEND_URL}/api/orders/${orderId}?user_id=${session.user.id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "X-User-ID": session.user.id.toString(),
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      console.error("❌ Error del backend:", {
        orderId,
        status: response.status,
        statusText: response.statusText,
        errorData,
      });

      return NextResponse.json(
        {
          success: false,
          message: "Error obteniendo orden",
          error:
            errorData?.error ||
            `Error ${response.status}: ${response.statusText}`,
        },
        { status: response.status }
      );
    }

    const result = await response.json();

    console.log("✅ Orden obtenida:", {
      orderId: parseInt(orderId),
      userId: session.user.id,
      orderStatus: result.data?.status,
      success: result.success,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("❌ Error en API route de orden por ID:", error);

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
