import { Pagination } from "@/app/(admin)/types/pagination";

export type StaffStatus = "active" | "inactive";

export type StaffProfile = {
  id: number;
  name: string;
  email: string;
  phoneNumber: string | null;
  phone?: string | null;
  identification: string | null;
  identificationType: string | null;
  role: string;
  active: boolean;
  emailNotifications: boolean | null;
  createdAt: Date;
  updatedAt: Date;
  image?: string | null;
};

export type Staff = {
  id: number;
  name: string;
  email: string;
  phoneNumber: string | null;
  role: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
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
