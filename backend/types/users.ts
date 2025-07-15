import { roles_enum } from "@prisma/client";

export interface createUserParams {
  name: string;
  email: string;
  emailVerified?: Date | null;
  password: string;
  phoneNumber?: string | null;
  identification?: string | null;
  role?: roles_enum;
}

export interface updateUserParams {
  id: number;
  name: string;
  email: string;
  emailVerified?: Date | null;
  phoneNumber?: string;
  identification?: string | null;
}

export interface updatePasswordParams {
  id: number;
  newPassword: string;
}