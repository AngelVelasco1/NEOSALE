import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/app/(auth)/auth";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function GET(request: NextRequest) {
    try {
        const session = await auth();

        if (!session?.user?.id) {
            return NextResponse.json(
                { success: false, message: "Usuario no autenticado" },
                { status: 401 }
            );
        }

        const { searchParams } = request.nextUrl;

        const response = await fetch(
            `${BACKEND_URL}/api/customers?${searchParams.toString()}`,
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
                status: response.status,
                statusText: response.statusText,
                errorData,
            });

            return NextResponse.json(
                {
                    success: false,
                    message: "Error obteniendo clientes",
                    error: errorData?.error || `Error ${response.status}: ${response.statusText}`,
                },
                { status: response.status }
            );
        }

        const result = await response.json();
        return NextResponse.json(result);
    } catch (error) {
        console.error("❌ Error en API route de clientes:", error);

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
