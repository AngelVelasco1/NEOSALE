"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { ServerActionResponse } from "@/app/(admin)/types/server-action";

export async function deleteStaff(
  staffId: string
): Promise<ServerActionResponse> {
  try {
    // TODO: Si usas Cloudinary u otro servicio, elimina la imagen aquí
    // const staff = await prisma.user.findUnique({
    //   where: { id: parseInt(staffId) },
    //   select: { image: true }
    // });

    await prisma.user.delete({
      where: { id: parseInt(staffId), role: "admin" },
    });

    revalidatePath("/staff");

    return { success: true };
  } catch (error) {
    console.error("Database delete failed:", error);
    return { dbError: "Something went wrong. Could not delete the staff." };
  }
}
