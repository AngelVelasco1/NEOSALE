"use server";

import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import { profileFormSchema } from "@/app/(admin)/dashboard/edit-profile/_components/schema";
import { formatValidationErrors } from "@/app/(admin)/helpers/formatValidationErrors";
import { ProfileServerActionResponse } from "@/app/(admin)/types/server-action";

export async function editProfile(
  userId: string,
  formData: FormData
): Promise<ProfileServerActionResponse> {
  const parsedData = profileFormSchema.safeParse({
    name: formData.get("name"),
    phone: formData.get("phone"),
    image: formData.get("image"),
  });

  if (!parsedData.success) {
    return {
      validationErrors: formatValidationErrors(
        parsedData.error.flatten().fieldErrors
      ),
    };
  }

  const { image, ...profileData } = parsedData.data;

  let imageUrl: string | undefined;

  // TODO: Implementar upload de imagen con Cloudinary
  if (image instanceof File && image.size > 0) {
    // Por ahora, guardamos el nombre del archivo
    // Implementa tu solución de storage preferida aquí (Cloudinary, etc.)
    imageUrl = `/uploads/profiles/${image.name}`;
  }

  try {
    await prisma.user.update({
      where: { id: parseInt(userId) },
      data: {
        name: profileData.name,
        phone_number: profileData.phone,
        // ...(imageUrl && { image: imageUrl }), // TODO: Descomentar cuando necesites actualizar la imagen
      },
    });

    revalidatePath("/dashboard/edit-profile");

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
      }
    }

    console.error("Database update failed:", error);
    return { dbError: "Something went wrong. Please try again later." };
  }
}
