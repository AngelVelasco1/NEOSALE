"use server";

import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import { staffFormSchema } from "@/app/(admin)/dashboard/staff/_components/form/schema";
import { formatValidationErrors } from "@/app/(admin)/helpers/formatValidationErrors";
import { StaffServerActionResponse } from "@/app/(admin)/types/server-action";

export async function editStaff(
  staffId: string,
  formData: FormData
): Promise<StaffServerActionResponse> {
  const parsedData = staffFormSchema.safeParse({
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

  const { image, ...staffData } = parsedData.data;

  let imageUrl: string | undefined;

  // TODO: Implementar upload de imagen con Cloudinary
  if (image instanceof File && image.size > 0) {
    // Por ahora, guardamos el nombre del archivo
    // Implementa tu solución de storage preferida aquí (Cloudinary, etc.)
    imageUrl = `/uploads/staff/${image.name}`;
  }

  try {
    const updatedStaff = await prisma.user.update({
      where: { id: parseInt(staffId) },
      data: {
        name: staffData.name,
        phoneNumber: staffData.phone,
        // ...(imageUrl && { image: imageUrl }), // TODO: Descomentar cuando necesites actualizar la imagen
      },
    });

    revalidatePath("/staff");

    return { success: true, staff: updatedStaff };
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
    return { success: false, error: "Something went wrong. Please try again later." };
  }
}
