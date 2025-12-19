import { v2 as cloudinary } from "cloudinary";

// Configurar Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Opciones de optimización para diferentes tipos de imágenes
 */
interface ImageOptimizationOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number | "auto";
  format?: string;
}

const OPTIMIZATION_PRESETS = {
  profile: {
    maxWidth: 400,
    maxHeight: 400,
    quality: 80,
    format: "webp",
  },
  product: {
    maxWidth: 1200,
    maxHeight: 1200,
    quality: 85,
    format: "webp",
  },
  banner: {
    maxWidth: 1920,
    maxHeight: 1080,
    quality: 85,
    format: "webp",
  },
} as const;

/**
 * Sube una imagen a Cloudinary con optimización automática
 * @param file - Archivo de imagen a subir
 * @param folder - Carpeta en Cloudinary donde se guardará la imagen
 * @param preset - Preset de optimización: "profile", "product", o "banner"
 * @param customOptions - Opciones personalizadas que sobrescriben el preset
 * @returns URL pública de la imagen optimizada
 */
export async function uploadImageToCloudinary(
  file: File,
  folder: string = "neosale/products",
  preset: keyof typeof OPTIMIZATION_PRESETS = "product",
  customOptions?: ImageOptimizationOptions
): Promise<string> {
  try {
    // Convertir el archivo a buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Obtener opciones del preset
    const options = { ...OPTIMIZATION_PRESETS[preset], ...customOptions };

    // Subir a Cloudinary usando upload_stream con transformaciones agresivas
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: folder,
          resource_type: "image",
          // Transformaciones para optimización máxima
          transformation: [
            // 1. Redimensionar manteniendo aspecto ratio
            {
              width: options.maxWidth,
              height: options.maxHeight,
              crop: "limit",
              fetch_format: options.format,
            },
            // 2. Aplicar compresión y calidad
            {
              quality: options.quality,
              flags: "lossy", // Compresión lossy para menor tamaño
            },
            // 3. Optimizaciones adicionales
            {
              flags: ["progressive", "strip_profile"], // Progressive JPEG y eliminar metadata
            },
          ],
          // Configuración adicional para reducir tamaño
          eager: [
            {
              width: options.maxWidth,
              height: options.maxHeight,
              crop: "limit",
              quality: options.quality,
              fetch_format: options.format,
            },
          ],
          eager_async: false, // Esperar a que se genere la versión optimizada
          overwrite: true,
          invalidate: true,
        },
        (error, result) => {
          if (error) {
            console.error("Cloudinary upload error:", error);
            reject(new Error("Failed to upload image to Cloudinary"));
          } else if (result) {
            resolve(result.secure_url);
          } else {
            reject(new Error("No result from Cloudinary"));
          }
        }
      );

      uploadStream.end(buffer);
    });
  } catch (error) {
    console.error("Error processing image:", error);
    throw new Error("Failed to process image for upload");
  }
}

/**
 * Elimina una imagen de Cloudinary
 * @param imageUrl - URL de la imagen a eliminar
 * @returns true si se eliminó correctamente
 */
export async function deleteImageFromCloudinary(
  imageUrl: string
): Promise<boolean> {
  try {
    // Extraer el public_id de la URL
    const urlParts = imageUrl.split("/");
    const fileWithExtension = urlParts[urlParts.length - 1];
    const publicId = fileWithExtension.split(".")[0];
    const folder = urlParts.slice(-2, -1)[0];
    const fullPublicId = `${folder}/${publicId}`;

    const result = await cloudinary.uploader.destroy(fullPublicId);
    return result.result === "ok";
  } catch (error) {
    console.error("Error deleting image from Cloudinary:", error);
    return false;
  }
}

export { cloudinary };
