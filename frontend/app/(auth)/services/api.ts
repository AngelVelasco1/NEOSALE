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


export const getUserById = async (userId: number) => {
  const { data } = await api.get(`/api/use/getUser?id=${userId}`);
  return data;
}

export const updateUser = async (userData: {
  id: number;
  name: string;
  email: string;
  emailVerified?: boolean;
  password?: string;
  phoneNumber?: string;
  identification?: string;
}) => {
  const { data } = await api.put("/api/use/updateUser", userData);
  return data; 
}