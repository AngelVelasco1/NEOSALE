import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/app/(auth)/auth";
import { getAuthToken } from "@/lib/auth-helpers";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function GET(request: NextRequest) {
    try {
        const session = await auth();

        if (!session?.user) {
            return NextResponse.json(
                { success: false, message: "Usuario no autenticado" },
                { status: 401 }
            );
        }

        // Build auth token in the format the backend expects: "userId:role"
        const token = await getAuthToken();

        if (!token) {
            return NextResponse.json(
                { success: false, message: "No se pudo obtener el token de autenticación" },
                { status: 401 }
            );
        }

        const { searchParams } = request.nextUrl;

        const response = await fetch(
            `${BACKEND_URL}/api/admin/categories?${searchParams.toString()}`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
            }
        );

        if (!response.ok) {
            const errorData = await response.json().catch(() => null);
            console.error("❌ Error del backend (categories):", {
                status: response.status,
                statusText: response.statusText,
                errorData,
            });

            return NextResponse.json(
                {
                    success: false,
                    message: "Error obteniendo categorías",
                    error: errorData?.error || `Error ${response.status}: ${response.statusText}`,
                },
                { status: response.status }
            );
        }

        const result = await response.json();
        return NextResponse.json(result);
    } catch (error) {
        console.error("❌ Error en API route de categorías:", error);

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
