"use server";

import { apiClient } from "@/lib/api-client";
import { requireAdmin } from "@/lib/auth-helpers";
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
    // Verify admin access (optional since apiClient will also validate via auth middleware)
    await requireAdmin();

    const queryParams = new URLSearchParams();
    queryParams.append("page", page.toString());
    queryParams.append("limit", limit.toString());
    if (search) queryParams.append("search", search);
    if (role && role !== "all") queryParams.append("role", role);

    // apiClient automatically injects auth token via getAuthToken()
    const response = await apiClient.get(
      `/users/admin/staff?${queryParams}`,
      {}
    );

    if (!response.success) {
      throw new Error("Error al obtener staff");
    }

    return response.data;
  } catch (error) {
    console.error("Failed to fetch staff:", error);
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

    const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 
      (process.env.NODE_ENV === 'production' ? '' : 'http://localhost:8000');

    const response = await fetch(
      `${BACKEND_URL}/api/users/${userId}`,
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
