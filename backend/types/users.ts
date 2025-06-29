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