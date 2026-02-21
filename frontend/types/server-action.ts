export type DbErrorResponse = {
  success: false;
  error: string;
};

export type SuccessResponse = {
  success: true;
  message?: string;
  data?: any;
};

export type ServerActionResponse = DbErrorResponse | SuccessResponse;

export type VServerActionResponse =
  | DbErrorResponse
  | (SuccessResponse & { validation_errors?: Record<string, string> })
 | ServerActionResponse;

export type ProductServerActionResponse =
  | Omit<DbErrorResponse, "">
  | (Omit<SuccessResponse, ""> & { product?: any })
  | ServerActionResponse;

export type CategoryServerActionResponse =
  | Omit<DbErrorResponse, "">
  | (Omit<SuccessResponse, ""> & { category?: any })
  | ServerActionResponse;

export type CouponServerActionResponse =
  | Omit<DbErrorResponse, "">
  | (Omit<SuccessResponse, ""> & { coupon?: any })
  | ServerActionResponse;

export type CustomerServerActionResponse =
  | Omit<DbErrorResponse, "">
  | (Omit<SuccessResponse, ""> & { customer?: any })
  | ServerActionResponse;

export type StaffServerActionResponse =
  | Omit<DbErrorResponse, "">
  | (Omit<SuccessResponse, ""> & { staff?: any })
  | ServerActionResponse;

export type ProfileServerActionResponse =
  | Omit<DbErrorResponse, "">
  | (Omit<SuccessResponse, ""> & { user?: any })
  | ServerActionResponse;
