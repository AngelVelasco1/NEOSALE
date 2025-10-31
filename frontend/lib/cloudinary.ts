import { v2 as cloudinary } from "cloudinary";

// Configurar Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Sube una imagen a Cloudinary
 * @param file - Archivo de imagen a subir
 * @param folder - Carpeta en Cloudinary donde se guardará la imagen
 * @returns URL pública de la imagen subida
 */
export async function uploadImageToCloudinary(
  file: File,
  folder: string = "neosale/products"
): Promise<string> {
  try {
    // Convertir el archivo a buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Subir a Cloudinary usando upload_stream
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: folder,
          resource_type: "image",
          transformation: [
            { width: 1000, height: 1000, crop: "limit" }, // Limitar tamaño máximo
            { quality: "auto" }, // Optimización automática de calidad
            { fetch_format: "auto" }, // Formato automático (WebP si es soportado)
          ],
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
