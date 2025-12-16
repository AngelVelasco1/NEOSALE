import { Metadata } from "next";

import AllOrders from "./_components/orders-table";
import OrderFilters from "./_components/OrderFilters";
import { PiPackageDuotone } from "react-icons/pi";


export const metadata: Metadata = {
  title: "Orders",
};

export default async function OrdersPage() {
  return (
    <section className="space-y-6 p-3 min-h-screen">
              <div>
               <div className="flex items-center gap-3">
                 <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/20">
                   <PiPackageDuotone className="h-6 w-6 text-white" />
                 </div>
                 <div>
                   <h1 className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-4xl font-bold text-transparent">
                     Gestión de Productos
                   </h1>
                   <p className="mt-1 text-slate-400">
                      Administra y organiza los productos de tu tienda
                   </p>
                 </div>
               </div>
             </div>
  <OrderFilters />
      <AllOrders />         </section>
   
  );
}
