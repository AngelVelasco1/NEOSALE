type ValidationErrorsResponse = {
  validationErrors?: Record<string, string>;
  validationError?: string;
  [key: string]: any;
};

type DbErrorResponse = {
  success: false;
  error?: string;
  dbError?: string;
  [key: string]: any;
};

type SuccessResponse = {
  success: true;
  message?: string;
  data?: any;
  [key: string]: any;
};

export type ServerActionResponse = DbErrorResponse | SuccessResponse | { [key: string]: any };

export type VServerActionResponse =
  | ValidationErrorsResponse
  | ServerActionResponse;

export type ProductServerActionResponse = any;

export type CategoryServerActionResponse = any;

export type CouponServerActionResponse = any;

export type CustomerServerActionResponse = any;

export type StaffServerActionResponse = any;

export type ProfileServerActionResponse = any;
