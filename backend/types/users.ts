import { roles_enum } from "@prisma/client";

export interface createUserParams {
  name: string;
  email: string;
  phoneNumber: string;
  password: string;
  emailVerified?: boolean | null;
  identification?: string | null;
  role?: roles_enum;
}

export interface updateUserParams {
  id: number;
  name?: string;
  email?: string;
  emailVerified?: boolean | null;
  password?: string;
  phoneNumber?: string;
  identification?: string | null;
  role?: roles_enum;
}