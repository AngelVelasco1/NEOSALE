export interface Brand {
  id: number;
  name: string;
  description: string | null;
  image_url: string | null;
  active: boolean;
  _count?: {
    products: number;
  };
}

export interface BrandWithProducts extends Brand {
  products: Array<{
    id: number;
    name: string;
    price: number;
    stock: number;
    images: Array<{
      id: number;
      image_url: string;
    }>;
  }>;
}

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export async function getAllBrands(): Promise<Brand[]> {
  try {
    const response = await fetch(`${BACKEND_URL}/api/brands`, {
      next: { revalidate: 3600 }, // Cache 1 hour
    });

    if (!response.ok) {
      throw new Error("Failed to fetch brands");
    }

    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error("Error fetching brands:", error);
    throw new Error("Failed to fetch brands");
  }
}

export async function getBrandById(id: number): Promise<BrandWithProducts | null> {
  try {
    const response = await fetch(`${BACKEND_URL}/api/brands/${id}`, {
      next: { revalidate: 3600 }, // Cache 1 hour
    });

    if (!response.ok) {
      if (response.status === 404) return null;
      throw new Error("Failed to fetch brand");
    }

    const data = await response.json();
    return data.data || null;
  } catch (error) {
    console.error("Error fetching brand:", error);
    throw new Error("Failed to fetch brand");
  }
}

export async function getBrandBySlug(slug: string): Promise<BrandWithProducts | null> {
  try {
    // Convert slug to brand name
    const name = slug
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

    const response = await fetch(`${BACKEND_URL}/api/brands/name/${encodeURIComponent(name)}`, {
      next: { revalidate: 3600 }, // Cache 1 hour
    });

    if (!response.ok) {
      if (response.status === 404) return null;
      throw new Error("Failed to fetch brand");
    }

    const data = await response.json();
    return data.data || null;
  } catch (error) {
    console.error("Error fetching brand by slug:", error);
    throw new Error("Failed to fetch brand");
  }
}
