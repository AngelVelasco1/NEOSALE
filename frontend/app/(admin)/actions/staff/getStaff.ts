"use server";

import { auth } from "@/app/(auth)/auth";

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
    const session = await auth();

    if (!session?.user || session.user.role !== "admin") {
      throw new Error("No autorizado");
    }

    const params = new URLSearchParams();
    params.append("page", page.toString());
    params.append("limit", limit.toString());
    if (search) params.append("search", search);
    if (role && role !== "all") params.append("role", role);

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/admin/staff?${params}`,
      {
        headers: {
          Authorization: `Bearer ${session?.user?.id}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Error al obtener staff");
    }

    return await response.json();
  } catch (error) {
    
    throw new Error("Failed to fetch staff");
  }
}

export async function getStaffRolesDropdown() {
  try {
    // Roles disponibles
    const roles = [
      { name: "admin", display_name: "Administrator" },
      { name: "user", display_name: "User" },
    ];

    return roles;
  } catch (error) {
    
    throw new Error("Failed to fetch staff roles");
  }
}

export async function getStaffDetails(userId: number) {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== "admin") {
      throw new Error("No autorizado");
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/${userId}`,
      {
        headers: {
          Authorization: `Bearer ${session?.user?.id}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Error al obtener detalles del staff");
    }

    return await response.json();
  } catch (error) {
    
    throw new Error("Failed to fetch staff details");
  }
}
