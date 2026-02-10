import { prisma } from "../lib/prisma";

export const getAllBrandsService = async () => {
  const brands = await prisma.brands.findMany({
    where: {
      active: true,
      deleted_at: null,
    },
    select: {
      id: true,
      name: true,
      description: true,
      image_url: true,
      active: true,
      _count: {
        select: {
          products: {
            where: {
              active: true,
            },
          },
        },
      },
    },
    orderBy: {
      name: "asc",
    },
  });

  return brands;
};

export const getBrandByIdService = async (id: number) => {
  const brand = await prisma.brands.findUnique({
    where: {
      id,
      active: true,
      deleted_at: null,
    },
    select: {
      id: true,
      name: true,
      description: true,
      image_url: true,
      active: true,
      products: {
        where: {
          active: true,
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
            },
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
            },
          },
        },
      },
    },
  });

  return brand;
};

export const getBrandByNameService = async (name: string) => {
  const brand = await prisma.brands.findFirst({
    where: {
      name: {
        equals: name,
        mode: "insensitive",
      },
      active: true,
      deleted_at: null,
    },
    select: {
      id: true,
      name: true,
      description: true,
      image_url: true,
      active: true,
      products: {
        where: {
          active: true,
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
            },
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
            },
          },
        },
      },
    },
  });

  return brand;
};
