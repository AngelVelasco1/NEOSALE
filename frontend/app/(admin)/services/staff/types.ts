import { Pagination } from "@/types/pagination";

export type StaffStatus = "active" | "inactive";

export type SBStaff = {
  id: number;
  name: string;
  email: string;
  phone_number: string | null;
  identification: string | null;
  identification_type: string | null;
  role: string;
  active: boolean;
  email_notifications: boolean | null;
  created_at: Date;
  updated_at: Date;
};

export type Staff = {
  id: number;
  name: string;
  email: string;
  phone_number: string | null;
  role: string;
  active: boolean;
  created_at: Date;
  updated_at: Date;
};

export interface FetchStaffParams {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
}

export interface FetchStaffResponse {
  data: Staff[];
  pagination: Pagination;
}

export type StaffRolesDropdown = {
  name: string;
  display_name: string;
};
