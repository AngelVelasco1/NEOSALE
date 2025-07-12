import { roles_enum } from "@prisma/client";

export interface createUserParams {
  name: string;
  email: string;
  phoneNumber?: string | null;
  password: string;
  emailVerified?: boolean | null;
  identification?: string | null;
  role?: roles_enum;
}

export interface updateUserParams {
  id: number;
  name: string;
  email: string;
  emailVerified?: boolean | null;
  phoneNumber?: string;
  identification?: string | null;
}

export interface updatePasswordParams {
  id: number;
  newPassword: string;
}