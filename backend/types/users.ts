import { roles_enum } from "@prisma/client";

export interface createUserParams {
  name: string;
  email: string;
  email_verified?: Date | null;
  password: string;
  phone_number?: string | null;
  identification?: string | null;
  role?: roles_enum;
  acceptTerms?: boolean;
  acceptPrivacy?: boolean;
}

export interface updateUserParams {
  id: number;
  name: string;
  email: string;
  email_verified?: Date | null;
  phone_number?: string;
  identification?: string | null;
}

export interface updatePasswordParams {
  id: number;
  newPassword: string;
}