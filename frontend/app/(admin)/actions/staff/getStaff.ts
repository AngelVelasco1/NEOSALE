"use server";

import { prisma } from "@/lib/prisma";

export type GetStaffParams = {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
};

export async function getStaff({
  page = 1,
  limit = 10,
  search,
  role,
}: GetStaffParams = {}) {
  try {
    const where: any = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { phone_number: { contains: search, mode: "insensitive" } },
      ];
    }

    if (role && role !== "all") {
      where.role = role;
    }

    const [data, total] = await Promise.all([
      prisma.user.findMany({
        where: {
          ...where,
          role: role || { in: ["admin"] }, // Solo usuarios con rol admin o específico
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: {
          created_at: "desc",
        },
        select: {
          id: true,
          name: true,
          email: true,
          phone_number: true,
          role: true,
          active: true,
          created_at: true,
          updated_at: true,
        },
      }),
      prisma.user.count({ where }),
    ]);

    return {
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  } catch (error) {
    console.error("Error fetching staff:", error);
    throw new Error("Failed to fetch staff");
  }
}

export async function getStaffRolesDropdown() {
  try {
    // Como usas un enum, retornamos los roles disponibles
    const roles = [
      { name: "admin", display_name: "Administrator" },
      { name: "user", display_name: "User" },
    ];

    return roles;
  } catch (error) {
    console.error("Error fetching staff roles:", error);
    throw new Error("Failed to fetch staff roles");
  }
}

export async function getStaffDetails(userId: number) {
  try {
    const staff = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone_number: true,
        identification: true,
        identification_type: true,
        role: true,
        active: true,
        email_notifications: true,
        created_at: true,
        updated_at: true,
        image: true,
      },
    });

    return staff;
  } catch (error) {
    console.error("Error fetching staff details:", error);
    throw new Error("Failed to fetch staff details");
  }
}
