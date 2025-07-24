import { api } from "@/config/api";

export const registerUser = async (userData: {
  name: string;
  email: string;
  emailVerified?: Date;
  password: string;
  phoneNumber?: string;
}) => {
  const { data } = await api.post("/api/users/register", userData);
  return data; 
}


export const getUserById = async (userId: number) => {
  const { data } = await api.get(`/api/users/getUser?id=${userId}`);
  return data;
}

export const updateUser = async (userData: {
  id: number;
  name: string;
  email: string;
  emailVerified?: Date;
  phoneNumber?: string;
  identification?: string;
}) => {
  const { data } = await api.put("/api/users/updateUser", userData);
  return data; 
}


export const updatePassword = async (userData: {
  id: number;
  newPassword: string;
}
) => {
  const { data } = await api.put("/api/users/updatePassword", userData);
  return data;
}