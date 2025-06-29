export interface createUserParams {
  name: string;
  email: string;
  phoneNumber: string;
  password: string;
  emailVerified?: boolean;
  identification?: string;
  role?: 'user' | 'admin';
}