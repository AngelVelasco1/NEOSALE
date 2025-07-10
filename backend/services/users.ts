import { prisma } from "../lib/prisma";
import bcrypt from "bcryptjs";
import { createUserParams, updateUserParams } from "../types/users";
import { roles_enum, Prisma } from "@prisma/client"

export const registerUserService = async ({
  name,
  email,
  emailVerified,
  password,
  phoneNumber,
  identification,
  role
}: createUserParams) => {
  if (!name || !email || !phoneNumber || !password) {
    throw new Error("Campos requeridos faltantes");
  }

  const existingUser = await prisma.users.findUnique({
    where: { email }
  });

  if (existingUser) {
    throw new Error("Este email ya está registrado.");
  }

  const hashedPassword = await bcrypt.hash(password, 12);
  try {
    await prisma.$executeRaw`
      CALL sp_createuser(
        ${name}, 
        ${email}, 
        ${emailVerified ?? false}, 
        ${hashedPassword}, 
        ${phoneNumber}, 
        ${identification ?? null}, 
        ${role as roles_enum ?? "user"})`;

    const newUser = await prisma.users.findUnique({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
        emailverified: true,
        password: true,
        phonenumber: true,
        identification: true,
        role: true,
      }
    });

    return newUser;
  } catch (error: any) {
    // ✅ Manejo de error robusto para $executeRaw
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      // El código 'P2010' es para fallos en raw queries
      if (error.code === 'P2010' || error.message.includes('23505')) {
        if (error.message.toLowerCase().includes('Key (phonenumber)')) {
          throw new Error('Este número de teléfono ya está registrado.');
        }
        if (error.message.toLowerCase().includes('Key (email)')) {
          throw new Error('Este email ya está registrado.');
        }
      }
    }
    throw error;
  }
}

export const getUserByIdService = async (id: number | undefined) => {
  if (!id) {
    throw new Error("ID de usuario requerido");
  }

  const user = await prisma.users.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      emailverified: true,
      phonenumber: true,
      password: true,
      identification: true,
      role: true,
      addresses: {
        select: {
          id: true,
          address: true,
          city: true,
          country: true
        }
      }
    }
  },
  );


  return user;
};


export const updateUserService = async ({ id, name, email, emailVerified, password, phoneNumber, identification }: updateUserParams) => {
  if (!id || !name || !email || !password) {
    throw new Error("Campos Obligatorios requeridos");
  }
  
  const idAsInt = Number(id);
  const hashedPassword = await bcrypt.hash(password, 12);
  const nullIdentification = identification && identification.trim() !== "" ? identification.trim() : null;

  try {
    await prisma.$executeRaw` CALL sp_updateUser(
    ${idAsInt}::int, 
    ${name}::text, 
    ${email}::text, 
    ${emailVerified ?? null}::boolean, 
    ${hashedPassword}::text, 
    ${phoneNumber ?? null}::text, 
    ${nullIdentification}::text
)`;
      const user = await prisma.users.findUnique({
      where: { id: idAsInt },
      select: {
        id: true,
        name: true,
        email: true,
        emailverified: true,
        password: true,
        phonenumber: true,
        identification: true
      }
    });
  if (!user) {
      throw new Error("Usuario no encontrado");
    }
    return user
  } catch(err) {
    throw new Error("Error al actualizar el usuario: " + err);
  }

};