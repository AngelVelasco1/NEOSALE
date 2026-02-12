import { NextRequest, NextResponse } from "next/server";
import { uploadImageToCloudinary } from "@/lib/cloudinary";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const folder = formData.get("folder") as string || "neosale/profiles";
    const preset = formData.get("preset") as "profile" | "product" | "banner" || "profile";

    if (!file) {
      return NextResponse.json(
        { success: false, message: "No se proporcionó ningún archivo" },
        { status: 400 }
      );
    }

    // Validar tipo de archivo
    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, message: "Tipo de archivo no válido. Solo se permiten imágenes JPEG, PNG y WebP" },
        { status: 400 }
      );
    }

    // Validar tamaño (máximo 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { success: false, message: "El archivo es demasiado grande. Tamaño máximo: 5MB" },
        { status: 400 }
      );
    }

    // Subir a Cloudinary
    const imageUrl = await uploadImageToCloudinary(file, folder, preset);

    return NextResponse.json({
      success: true,
      data: { url: imageUrl },
      message: "Imagen subida exitosamente",
    });
  } catch (error: any) {
    
    return NextResponse.json(
      { success: false, message: error.message || "Error al subir la imagen" },
      { status: 500 }
    );
  }
}
