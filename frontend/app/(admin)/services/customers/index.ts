import {
  Customer,
  FetchCustomersParams,
  FetchCustomersResponse,
  CustomerOrder,
} from "./types";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

export async function fetchCustomers({
  page = 1,
  limit = 10,
  search,
}: FetchCustomersParams): Promise<FetchCustomersResponse> {
  const queryParams = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    ...(search && { search }),
  });

  const response = await fetch(
    `${BACKEND_URL}/api/users/getUsers?${queryParams.toString()}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch customers");
  }

  return response.json();
}

export async function fetchCustomerOrders({ id }: { id: string }) {
  const response = await fetch(`/api/customers/${id}/orders`);

  if (!response.ok) {
    console.error("Failed to fetch customer orders");
    throw new Error("Failed to fetch customer orders");
  }

  const data = await response.json();
  return {
    customerOrders: data as CustomerOrder[],
  };
}
