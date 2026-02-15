"use server";

import { revalidatePath } from "next/cache";
import { Prisma } from "@/prisma/generated/prisma/client";
import bcrypt from "bcryptjs";

import { prisma } from "@/lib/prisma";
import {
  uploadImageToCloudinary,
  deleteImageFromCloudinary,
} from "@/lib/cloudinary";
import { profileFormSchema } from "@/app/(admin)/dashboard/edit-profile/_components/schema";
import { formatValidationErrors } from "@/app/(admin)/helpers/formatValidationErrors";
import { ProfileServerActionResponse } from "@/app/(admin)/types/server-action";

export async function editProfile(
  userId: string,
  formData: FormData
): Promise<ProfileServerActionResponse> {
  // Validar datos del formulario
  const parsedData = profileFormSchema.safeParse({
    name: formData.get("name"),
    phone: formData.get("phone"),
    image: formData.get("image"),
    currentPassword: formData.get("currentPassword"),
    newPassword: formData.get("newPassword"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!parsedData.success) {
    return {
      validationErrors: formatValidationErrors(
        parsedData.error.flatten().fieldErrors
      ),
    };
  }

  const { image, ...profileData } = parsedData.data;
  const userIdInt = parseInt(userId);

  // Validar que el ID sea válido
  if (isNaN(userIdInt) || userIdInt <= 0) {
    return { success: false, error: "Invalid user ID." };
  }

  try {
    // Obtener el usuario actual para verificar la imagen anterior
    const currentUser = await prisma.user.findUnique({
      where: { id: userIdInt },
      select: { image: true, email: true },
    });

    if (!currentUser) {
      return { success: false, error: "User not found." };
    }

    let imageUrl: string | undefined = currentUser.image || undefined;

    // Procesar nueva imagen si se proporciona un archivo
    if (image instanceof File && image.size > 0) {
      try {
        // Subir nueva imagen a Cloudinary con preset de perfil (optimización agresiva)
        const newImageUrl = await uploadImageToCloudinary(
          image,
          "neosale/profiles",
          "profile" // Preset que reduce a 400x400 y calidad 80 en WebP
        );

        // Si la subida fue exitosa y hay una imagen anterior, eliminarla
        if (newImageUrl && currentUser.image) {
          try {
            await deleteImageFromCloudinary(currentUser.image);
          } catch (deleteError) {
            // Log pero no fallar si no se puede eliminar la imagen anterior
            
          }
        }

        imageUrl = newImageUrl;
      } catch (uploadError) {
        
        return {
          success: false,
          error:
            "Failed to upload profile picture. Please try again or use a different image.",
        };
      }
    }

    // Preparar datos para actualizar
    const updateData: Prisma.UserUpdateInput = {
      name: profileData.name,
      updatedAt: new Date(),
    };

    // Agregar phoneNumber solo si se proporciona
    if (profileData.phone && profileData.phone.trim() !== "") {
      updateData.phoneNumber = profileData.phone;
    } else {
      updateData.phoneNumber = null;
    }

    // Agregar imagen solo si cambió
    if (imageUrl) {
      updateData.image = imageUrl;
    }

    // Actualizar usuario en la base de datos
    await prisma.user.update({
      where: { id: userIdInt },
      data: updateData,
    });

    // Revalidar caché de Next.js
    revalidatePath("/dashboard/edit-profile");
    revalidatePath("/dashboard");

    return { success: true };
  } catch (error) {
    // Manejar errores de unique constraint de Prisma
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        const target = error.meta?.target as string[];

        if (target?.includes("phone_number")) {
          return {
            validationErrors: {
              phone: "This phone number is already in use.",
            },
          };
        }

        if (target?.includes("email")) {
          return {
            validationErrors: {
              name: "This email is already in use.",
            },
          };
        }
      }

      // Registro no encontrado
      if (error.code === "P2025") {
        return { success: false, error: "User not found." };
      }
    }

    // Error genérico
    
    return {
      success: false,
      error:
        "Something went wrong while updating your profile. Please try again later.",
    };
  }
}
