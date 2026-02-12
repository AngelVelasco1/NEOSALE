import { NextRequest, NextResponse } from "next/server";
import { uploadImageToCloudinary } from "@/lib/cloudinary";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { error: "No se proporcionó ningún archivo" },
        { status: 400 }
      );
    }

    // Validar tipo de archivo
    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Tipo de archivo no válido. Solo se permiten imágenes JPEG, PNG y WebP" },
        { status: 400 }
      );
    }

    // Validar tamaño (máximo 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "El archivo es demasiado grande. Tamaño máximo: 5MB" },
        { status: 400 }
      );
    }

    // Subir a Cloudinary en la carpeta de reviews
    const imageUrl = await uploadImageToCloudinary(file, "neosale/reviews", "product");

    return NextResponse.json({
      secure_url: imageUrl,
      success: true,
    });
  } catch (error: any) {
    
    return NextResponse.json(
      { error: error.message || "Error al subir la imagen" },
      { status: 500 }
    );
  }
}
