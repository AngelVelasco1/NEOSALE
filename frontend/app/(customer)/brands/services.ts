import { prisma } from "@/lib/prisma";

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
      is_primary: boolean;
    }>;
  }>;
}

export async function getAllBrands(): Promise<Brand[]> {
  try {
    const brands = await prisma.brands.findMany({
      where: {
        active: true,
        deleted_at: null,
      },
      include: {
        _count: {
          select: {
            products: {
              where: {
                active: true,
                deleted_at: null,
              },
            },
          },
        },
      },
      orderBy: {
        name: "asc",
      },
    });

    return brands as Brand[];
  } catch (error) {
    console.error("Error fetching brands:", error);
    throw new Error("Failed to fetch brands");
  }
}

export async function getBrandById(id: number): Promise<BrandWithProducts | null> {
  try {
    const brand = await prisma.brands.findUnique({
      where: {
        id,
        active: true,
        deleted_at: null,
      },
      include: {
        products: {
          where: {
            active: true,
            deleted_at: null,
          },
          select: {
            id: true,
            name: true,
            price: true,
            stock: true,
            images: {
              select: {
                id: true,
                image_url: true,
                is_primary: true,
              },
              orderBy: [
                { is_primary: "desc" },
                { id: "asc" },
              ],
              take: 1,
            },
          },
          take: 50,
          orderBy: {
            created_at: "desc",
          },
        },
        _count: {
          select: {
            products: {
              where: {
                active: true,
                deleted_at: null,
              },
            },
          },
        },
      },
    });

    return brand as BrandWithProducts | null;
  } catch (error) {
    console.error("Error fetching brand:", error);
    throw new Error("Failed to fetch brand");
  }
}

export async function getBrandBySlug(slug: string): Promise<BrandWithProducts | null> {
  try {
    // Convert slug back to name (replace hyphens with spaces and capitalize)
    const name = slug
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

    const brand = await prisma.brands.findFirst({
      where: {
        name: {
          equals: name,
          mode: "insensitive",
        },
        active: true,
        deleted_at: null,
      },
      include: {
        products: {
          where: {
            active: true,
            deleted_at: null,
          },
          select: {
            id: true,
            name: true,
            price: true,
            stock: true,
            images: {
              select: {
                id: true,
                image_url: true,
                is_primary: true,
              },
              orderBy: [
                { is_primary: "desc" },
                { id: "asc" },
              ],
              take: 1,
            },
          },
          take: 50,
          orderBy: {
            created_at: "desc",
          },
        },
        _count: {
          select: {
            products: {
              where: {
                active: true,
                deleted_at: null,
              },
            },
          },
        },
      },
    });

    return brand as BrandWithProducts | null;
  } catch (error) {
    console.error("Error fetching brand by slug:", error);
    throw new Error("Failed to fetch brand");
  }
}
