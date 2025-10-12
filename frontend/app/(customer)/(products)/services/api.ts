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

export const getProductsByCategory = async (categoryName: string) => {
  const { data } = await api.get(
    `/api/products/getProducts?category=${encodeURIComponent(categoryName)}`
  );
  return data;
};

export const getProductsBySubcategory = async (subcategoryName: string) => {
  const { data } = await api.get(
    `/api/products/getProducts?subcategory=${encodeURIComponent(
      subcategoryName
    )}`
  );
  return data;
};

export const getProductVariantApi = async (productData: {
  id: number;
  color_code: string;
  size: string;
}) => {
  const { data } = await api.post(`/api/products/getVariantStock`, {
    id: productData.id,
    color_code: productData.color_code,
    size: productData.size,
  });
  return data;
};
