"use client";

import { SheetTrigger } from "@/components/ui/sheet";
import { editProduct } from "@/app/(admin)/actions/products/editProduct";
import { ProductDetails } from "@/app/(admin)/services/products/types";
import ProductFormSheet from "../../_components/form/ProductFormSheet";

import { useAuthorization } from "@/app/(admin)/hooks/use-authorization";

type Props = {
  product: ProductDetails;
  children: React.ReactNode;
};

export async function EditProductSheet({ product, children }: Props) {
  const { hasPermission } = useAuthorization();

  if (!hasPermission("products", "canEdit")) return null;

  return (
    <ProductFormSheet
      title="Update Products"
      description="Update necessary product information here"
      submitButtonText="Update Product"
      actionVerb="updated"
      initialData={{
        name: product.name,
        description: product.description ?? "",
        image: product.images?.[0]?.image_url,
        sku: (product as unknown as { sku?: string }).sku ?? "",
        category: String(product.category_id),
        brand: String(product.brand_id),
        price: product.price,
        stock: product.stock,
        weight_grams: product.weight_grams,
        sizes: product.sizes,
      }}
      action={(formData) => editProduct(String(product.id), formData)}
      previewImage={product.images?.[0]?.image_url}
    >
      <SheetTrigger asChild>{children}</SheetTrigger>
    </ProductFormSheet>
  );
}
