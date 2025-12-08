import { Metadata } from "next";

import PageTitle from "@/app/(admin)/components/shared/PageTitle";
import AllOrders from "./_components/orders-table";
import OrderFilters from "./_components/OrderFilters";

export const metadata: Metadata = {
  title: "Orders",
};

export default async function OrdersPage() {
  return (
    <section>
      <div className="mb-8 py-5 px-7 rounded-2xl bg-linear-to-br from-slate-100/80 via-blue-50/80 to-indigo-100/80 dark:from-slate-900/80 dark:via-slate-800/80 dark:to-slate-900/80 backdrop-blur-xl border border-slate-300/30 dark:border-slate-700/30 shadow-2xl shadow-slate-900/10 dark:shadow-black/50">
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
          <h1 className="text-4xl font-bold bg-linear-to-r from-slate-900 via-blue-900 to-indigo-900 dark:from-slate-100 dark:via-blue-200 dark:to-indigo-200 bg-clip-text text-transparent mb-3">
            Pedidos
          </h1>
          <p className="text-slate-700 dark:text-slate-300 text-base font-medium animate-in fade-in slide-in-from-bottom-2 duration-700 delay-150">
            Gestiona los pedidos realizados por los clientes, incluyendo detalles de estado, fechas y montos totales
          </p>
          <div className="h-1.5 w-32 bg-linear-to-r from-slate-700 via-blue-600 to-indigo-600 dark:from-slate-400 dark:via-blue-400 dark:to-indigo-400 rounded-full mt-4 shadow-lg shadow-blue-500/30 animate-in slide-in-from-left duration-700 delay-300" />
        </div>
      </div>
      <OrderFilters />
      <AllOrders />
    </section>
  );
}
