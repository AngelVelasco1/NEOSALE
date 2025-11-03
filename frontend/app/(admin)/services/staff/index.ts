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
  return getStaff(params);
}

export async function fetchStaffRolesDropdown() {
  return getStaffRolesDropdown();
}

export async function fetchStaffDetails(userId: number): Promise<SBStaff | null> {
  const staff = await getStaffDetailsAction(userId);
  return staff as SBStaff | null;
}
