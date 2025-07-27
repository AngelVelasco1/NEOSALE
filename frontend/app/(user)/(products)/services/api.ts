import { api } from "@/config/api";

export const getProducts = async () => {
  const { data } = await api.get("/api/products/getProducts");  
  return data;
};

export const getProduct = async (id: number) => {
  const { data } = await api.get(`/api/products/getProducts?id=${id}`);
  return data;
};

export const getLatestProducts = async () => {
  const { data } = await api.get(`/api/products/getLatestProducts`);
  return data;
};

