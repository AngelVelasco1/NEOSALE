import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const variantId = parseInt(params.id);

    if (isNaN(variantId)) {
      return NextResponse.json(
        { success: false, error: "ID de variante inválido" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { stock, price } = body;

    // Validar que al menos un campo esté presente
    if (stock === undefined && price === undefined) {
      return NextResponse.json(
        { success: false, error: "Debe proporcionar stock o price" },
        { status: 400 }
      );
    }

    // Preparar datos de actualización
    const updateData: any = {};

    if (stock !== undefined) {
      const stockNumber = Number(stock);
      if (isNaN(stockNumber) || stockNumber < 0) {
        return NextResponse.json(
          { success: false, error: "Stock inválido" },
          { status: 400 }
        );
      }
      updateData.stock = stockNumber;
    }

    if (price !== undefined) {
      const priceNumber = Number(price);
      if (isNaN(priceNumber) || priceNumber < 0) {
        return NextResponse.json(
          { success: false, error: "Precio inválido" },
          { status: 400 }
        );
      }
      updateData.price = priceNumber;
    }

    // Actualizar la variante
    const updatedVariant = await prisma.product_variants.update({
      where: { id: variantId },
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      variant: updatedVariant,
    });
  } catch (error) {
    console.error("Error updating variant:", error);
    return NextResponse.json(
      { success: false, error: "Error al actualizar la variante" },
      { status: 500 }
    );
  }
}
