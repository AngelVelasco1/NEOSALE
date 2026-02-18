import { notFound } from "next/navigation";
import { IoBagHandle } from "react-icons/io5";

import { Card } from "@/components/ui/card";
import Typography from "@/app/(admin)/components/ui/typography";
import PageTitle from "@/app/(admin)/components/shared/PageTitle";

import CustomerOrdersTable from "./_components/Table";
import { fetchCustomerOrders } from "@/app/(admin)/services/customers";

type PageParams = {
  params: Promise<{ id: string }>;
};

// Disable prerendering for this dynamic route since customer IDs are unknown at build time
export const dynamic = "force-dynamic";

// Return empty array to prevent static generation attempts
export async function generateStaticParams() {
  return [];
}

export default async function CustomerOrders({ params }: PageParams) {
  try {
    const { id } = await params;
    const { customer, orders } = await fetchCustomerOrders({ id });


    return (
      <section className="space-y-6">
        {/* Customer Info Card */}
        <Card className="p-6 bg-linear-to-br from-slate-900/50 to-slate-800/50 border-slate-700/50">
          <div className="flex items-center justify-between">
            <div>
              <Typography variant="h2" className="text-2xl font-bold mb-2">
                {customer.name}
              </Typography>
              <div className="flex flex-col gap-1 text-sm text-slate-400">
                <span>Email: {customer.email}</span>
                {customer.phoneNumber && (
                  <span>Teléfono: {customer.phoneNumber}</span>
                )}
              </div>
            </div>
            <div className="text-right">
              <Typography className="text-sm text-slate-400">Total de órdenes</Typography>
              <Typography className="text-3xl font-bold text-blue-400">
                {orders.length}
              </Typography>
            </div>
          </div>
        </Card>

        <PageTitle>Historial de Órdenes</PageTitle>

        {orders.length === 0 ? (
          <Card className="w-full flex flex-col text-center items-center py-8">
            <IoBagHandle className="text-red-500 size-20 mb-4" />
            <Typography>Este cliente no tiene órdenes todavía!</Typography>
          </Card>
        ) : (
          <CustomerOrdersTable data={orders} />
        )}
      </section>
    );
  } catch (e) {
    console.error("Error loading customer orders:", e);
    return notFound();
  }
}
