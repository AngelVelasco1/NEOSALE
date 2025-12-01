import {
  getStaff,
  getStaffRolesDropdown,
  getStaffDetails as getStaffDetailsAction,
} from "@/app/(admin)/actions/staff/getStaff";
import {
  FetchStaffParams,
  FetchStaffResponse,
  SBStaff,
} from "./types";

export async function fetchStaff(
  params: FetchStaffParams
): Promise<FetchStaffResponse> {
  const result = await getStaff(params);
  
  // Mapear la estructura de paginación del servidor a la esperada por el frontend
  const mappedResult: FetchStaffResponse = {
    data: result.data,
    pagination: {
      current: result.pagination.page,
      limit: result.pagination.limit,
      items: result.pagination.total,
      pages: result.pagination.totalPages,
      next: result.pagination.page < result.pagination.totalPages 
        ? result.pagination.page + 1 
        : null,
      prev: result.pagination.page > 1 
        ? result.pagination.page - 1 
        : null,
    }
  };

  return mappedResult;
}

export async function fetchStaffRolesDropdown() {
  return getStaffRolesDropdown();
}

export async function fetchStaffDetails(userId: number): Promise<SBStaff | null> {
  const staff = await getStaffDetailsAction(userId);
  return staff as SBStaff | null;
}
