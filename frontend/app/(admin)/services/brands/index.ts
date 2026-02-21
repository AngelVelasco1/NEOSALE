import { getBrandsDropdown } from "@/app/(admin)/actions/brands/getBrands";

export async function fetchBrandsDropdown() {
  return getBrandsDropdown();
}
