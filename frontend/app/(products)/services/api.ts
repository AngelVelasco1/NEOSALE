import axios from "axios";
import { FRONT_CONFIG } from '../../../config/credentials';

export const api = axios.create({
  baseURL: `http://${FRONT_CONFIG.host}:${FRONT_CONFIG.port}`,
});

export const getProducts = async () => {
  const { data } = await api.get("/api/use/products");  
  return data;
};

export const getProduct = async (id: number) => {
  const { data } = await api.get(`/api/use/products?id=${id}`);
  return data;
};

export const getLatestProducts = async () => {
  const { data } = await api.get(`/api/use/latestProducts`);
  return data;
};

