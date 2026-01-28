import { Metadata } from "next";

import AllOrders from "./_components/orders-table";
import OrderFilters from "./_components/OrderFilters";
import { PiPackageDuotone } from "react-icons/pi";


export const metadata: Metadata = {
  title: "Orders",
};

export default async function OrdersPage() {
  return (
    <section className="min-h-screen">
      <OrderFilters />
      <AllOrders />         
      </section>

  );
}
