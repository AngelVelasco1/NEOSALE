import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

import { prisma } from "@/lib/prisma";
import { passwordUpdateFormSchema } from "@/app/(admin)/(authentication)/update-password/_components/schema";
import validateFormData from "@/app/(admin)/helpers/validateFormData";
import { decodeResetToken, isResetTokenExpired } from "@/lib/resetToken";

export async function POST(request: Request) {
  try {
    const { password, confirmPassword, token } = await request.json();

    const { errors } = validateFormData(passwordUpdateFormSchema, {
      password,
      confirmPassword,
    });

    if (errors) {
      return NextResponse.json({ errors }, { status: 401 });
    }

    if (!token) {
      return NextResponse.json(
        {
          errors: {
            password: "El enlace de recuperación es inválido o ha expirado.",
          },
        },
        { status: 401 }
      );
    }

    const payload = decodeResetToken(token);

    if (!payload) {
      return NextResponse.json(
        {
          errors: {
            password: "El enlace de recuperación no es válido.",
          },
        },
        { status: 401 }
      );
    }

    if (isResetTokenExpired(payload)) {
      return NextResponse.json(
        {
          errors: {
            password: "El enlace de recuperación expiró. Solicita uno nuevo.",
          },
        },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({ where: { id: payload.userId } });

    if (!user || user.email !== payload.email) {
      return NextResponse.json(
        {
          errors: {
            password: "No pudimos validar tu cuenta. Solicita un nuevo enlace.",
          },
        },
        { status: 401 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    
    return NextResponse.json(
      {
        errors: {
          password: "No pudimos actualizar tu contraseña. Inténtalo más tarde.",
        },
      },
      { status: 500 }
    );
  }
}
