import { api } from "@/config/api";

export const registerUser = async (userData: {
  name: string;
  email: string;
  emailVerified?: boolean;
  password: string;
  phoneNumber?: string;
}) => {
  const { data } = await api.post("/api/use/register", userData);
  return data; 
}
