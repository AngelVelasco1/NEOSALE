import { api } from "@/config/api";

export const getCartApi = async (user_id: number) => {
  const { data } = await api.get(`/api/cart/getCart?user_id=${user_id}`);
  return data;
};

export const addProductToCartApi = async (productData: {
  user_id: number;
  product_id: number;
  quantity: number;
  color_code: string;
  size: string;
}) => {
  const { data } = await api.post("/api/cart/addProduct", productData);
  return data;
};

export const deleteProductFromCartApi = async (productData: {
  user_id: number;
  product_id: number;
  color_code: string;
  size: string;
}) => {
  const { data } = await api.delete("/api/cart/deleteProduct", { data: productData });
  return data;
};

export const updateQuantityApi = async (productData: {
   user_id: number;
    product_id: number;
    quantity: number;
    color_code: string;
    size: string;
}) => {
  const { data } = await api.put("/api/cart/updateProduct", productData);
  return data;
}