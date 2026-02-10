"use server";

import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import { customerFormSchema } from "@/app/(admin)/dashboard/customers/_components/form/schema";
import { formatValidationErrors } from "@/app/(admin)/helpers/formatValidationErrors";
import { CustomerServerActionResponse } from "@/app/(admin)/types/server-action";

export async function editCustomer(
  customerId: string,
  formData: FormData
): Promise<CustomerServerActionResponse> {
  const parsedData = customerFormSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
  });

  if (!parsedData.success) {
    return {
      validationErrors: formatValidationErrors(
        parsedData.error.flatten().fieldErrors
      ),
    };
  }

  const customerData = parsedData.data;

  try {
    const updatedCustomer = await prisma.user.update({
      where: { id: parseInt(customerId), role: "user" },
      data: {
        name: customerData.name,
        email: customerData.email,
        phoneNumber: customerData.phone,
      },
    });

    revalidatePath("/customers");
    revalidatePath(`/customer-orders/${updatedCustomer.id}`);

    return { success: true, customer: updatedCustomer };
  } catch (error) {
    // Manejar errores de unique constraint de Prisma
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        const target = error.meta?.target as string[];

        if (target?.includes("email")) {
          return {
            validationErrors: {
              email: "This email is already in use.",
            },
          };
        }
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
