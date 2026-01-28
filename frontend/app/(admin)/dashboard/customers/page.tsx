import { Metadata } from "next";

import AllCustomers from "./_components/customers-table";
import CustomerActions from "./_components/CustomerActions";
import CustomerFilters from "./_components/CustomerFilters";
import { RiUser3Fill } from "react-icons/ri";
export const metadata: Metadata = {
  title: "Customers",
};

export default async function CustomersPage() {
  return (
    <section className="space-y-6 p-3 min-h-screen">
      <CustomerFilters />
      <CustomerActions />
      <AllCustomers />
    </section>
  );
}
