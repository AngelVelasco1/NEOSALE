import { api } from "@/config/api";

export const registerUser = async (userData: {
  name: string;
  email: string;
  email_verified?: Date;
  password: string;
  phoneNumber?: string;
}) => {
  const { data } = await api.post("/api/users/register", userData);
  return data.data; 
}


export const getUserById = async (userId: number) => {
  const { data } = await api.get(`/api/users/getUser?id=${userId}`);
  return data.data;
}

export const updateUser = async (userData: {
  id: number;
  name: string;
  email: string;
  email_verified?: Date;
  phoneNumber?: string;
  identification?: string;
}) => {
  const { data } = await api.put("/api/users/updateUser", userData);
  return data.data; 
}


export const updatePassword = async (userData: {
  id: number;
  newPassword: string;
}
) => {
  const { data } = await api.put("/api/users/updatePassword", userData);
  return data.data;
}

// Address services
export const getUserAddresses = async (userId: number) => {
  const { data } = await api.get(`/api/addresses/getUserAddresses?user_id=${userId}`);
  return data.data;
}

export const createAddress = async (userId: number, addressData: {
  address: string;
  country: string;
  city: string;
  department: string;
  is_default?: boolean;
}) => {
  const { data } = await api.post(`/api/addresses/createAddress?user_id=${userId}`, addressData);
  return data.data;
}

export const updateAddress = async (userId: number, addressId: number, addressData: {
  address?: string;
  country?: string;
  city?: string;
  department?: string;
  is_default?: boolean;
}) => {
  const { data } = await api.put(`/api/addresses/updateAddress/${addressId}?user_id=${userId}`, addressData);
  return data.data;
}

export const deleteAddress = async (userId: number, addressId: number) => {
  const { data } = await api.delete(`/api/addresses/deleteAddress/${addressId}?user_id=${userId}`);
  return data.data;
}

export const setDefaultAddress = async (userId: number, addressId: number) => {
  const { data } = await api.post(`/api/addresses/setDefaultAddress/${addressId}?user_id=${userId}`);
  return data.data;
}

// Image upload service
export const uploadProfileImage = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("folder", "neosale/profiles");
  formData.append("preset", "profile");
  
  const { data } = await api.post("/api/upload-profile-image", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return data;
}

export const updateUserImage = async (userId: number, imageUrl: string) => {
  const { data } = await api.put("/api/users/updateUserImage", { id: userId, image: imageUrl });
  return data.data;
}