import {
  getStaff,
  getStaffRolesDropdown,
  getStaffDetails as getStaffDetailsAction,
} from "@/app/(admin)/actions/staff/getStaff";
import {
  FetchStaffParams,
  FetchStaffResponse,
  StaffProfile,
} from "./types";

export async function fetchStaff(
  params: FetchStaffParams
): Promise<FetchStaffResponse> {
  const result = await getStaff(params);
  const typedResult = result as unknown as FetchStaffResponse;
  
  // Mapear la estructura de paginación del servidor a la esperada por el frontend
  const mappedResult: FetchStaffResponse = {
    data: typedResult.data || [],
    pagination: {
      current: typedResult.pagination.current,
      limit: typedResult.pagination.limit,
      items: typedResult.pagination.items,
      pages: typedResult.pagination.pages,
      next: typedResult.pagination.next,
      prev: typedResult.pagination.prev,
    }
  };

  return mappedResult;
}

export async function fetchStaffRolesDropdown() {
  return getStaffRolesDropdown();
}

export async function fetchStaffDetails(userId: number): Promise<StaffProfile | null> {
  const staff = await getStaffDetailsAction(userId);
  return staff as StaffProfile | null;
}
