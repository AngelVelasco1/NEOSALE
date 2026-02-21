import { api } from "@/config/api";

export const getProducts = async () => {
  const { data } = await api.get("/api/products/getProducts");
  return data.data;
};

export const getProduct = async (id: number) => {
  const { data } = await api.get(`/api/products/getProducts?id=${id}`);
  return data.data;
};

export const getLatestProducts = async () => {
  try {
    // Usar la ruta RESTful nueva (/latest) en lugar de la deprecada
    const response = await api.get(`/api/products/latest`);
    const responseData = response.data;

    // Si es directo un array (debería venir envuelto)
    if (Array.isArray(responseData)) {
      return responseData;
    }

    // Si viene { success: true, data: [...] }
    if (responseData?.data && Array.isArray(responseData.data)) {
      return responseData.data;
    }

    return responseData?.data || [];
  } catch (error) {
    console.error("❌ Error fetchLatestProducts en API:", error);
    return [];
  }
};

export const getProductsByCategory = async (categoryName: string) => {
  const { data } = await api.get(
    `/api/products/getProducts?category=${encodeURIComponent(categoryName)}`
  );
  return data.data;
};

export const getProductsBySubcategory = async (subcategoryName: string) => {
  const { data } = await api.get(
    `/api/products/getProducts?subcategory=${encodeURIComponent(
      subcategoryName
    )}`
  );
  return data.data;
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
  return data.data;
};

export const getOffers = async () => {
  const { data } = await api.get("/api/products/getOffers");
  return data.data;
};
