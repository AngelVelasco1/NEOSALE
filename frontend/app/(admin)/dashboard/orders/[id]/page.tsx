import { notFound } from "next/navigation";
import { FaBagShopping } from "react-icons/fa6";
import { formatDate } from "@/lib/date-utils";

import PageTitle from "@/app/(admin)/components/shared/PageTitle";
import Typography from "@/app/(admin)/components/ui/typography";
import { Card } from "@/app/(admin)/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/(admin)/components/ui/table";
import { Badge } from "@/app/(admin)/components/ui/badge";

import { getDiscount } from "@/app/(admin)/helpers/getDiscount";
import { OrderBadgeVariants } from "@/app/(admin)/constants/badge";
import { fetchOrderDetails } from "@/app/(admin)/services/orders";
import { InvoiceActions } from "./_components/InvoiceActions";
import { ShippingManagement } from "./_components/ShippingManagement";

// Importar estilos específicos para el PDF
import "./invoice-pdf.css";

type PageParams = {
  params: Promise<{
    id: string;
  }>;
};

// Do NOT define generateMetadata or generateStaticParams - let this page be rendered on-demand only
// This is a dynamic [id] route that should not be prerendered

export default async function Order({ params }: PageParams) {
  try {
    const { id } = await params;

    const { order } = await fetchOrderDetails({ id });

    return (
      <section className="invoice-background p-4 ">

        <Card className="mb-8 glass-card glass-card-hover p-8 lg:p-10 print:border-none print:bg-white print:mb-0 relative overflow-hidden">
          {/* Subtle blue overlay */}
          <div className="absolute inset-0 bg-blue-950/20 pointer-events-none"></div>
          
          {/* Enhanced Header Section */}
          <div className="relative z-10">
            {/* Premium Header Container */}
            <div className="relative overflow-hidden rounded-2xl border-2 border-blue-900/70 mb-8 shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-950/70 via-indigo-950/60 to-sky-950/60 animate-pulse"></div>
              <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-radial from-blue-700/30 via-indigo-700/20 to-sky-700/10 rounded-full -translate-y-48 translate-x-48 animate-pulse"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-radial from-sky-700/20 via-blue-700/10 rounded-full translate-y-32 -translate-x-32 animate-pulse"></div>
              
              <div className="relative z-10 flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8 p-8 lg:p-12 print:flex-row print:justify-between">
                {/* Left Side - Invoice Info */}
                 <div className="flex flex-col items-start space-y-6 print:text-right print:text-black min-w-0 lg:max-w-sm">
                  {/* Premium Brand Section */}
                  <div className="relative text-left">
                    <div className="flex flex-col items-start space-y-2">
              
                      
                      <Typography
                        component="span"
                        variant="h1"
                        className="text-3xl md:text-4xl font-black bg-gradient-to-r from-blue-200 via-indigo-200 to-slate-300 bg-clip-text text-transparent print:text-black tracking-tight leading-none drop-shadow-md"
                      >
                        NEO$ALE
                      </Typography>
                      
                   
                    </div>
                  </div>

                  {/* Premium Contact Card */}
                  <div className="relative glass-info-card border-2 border-blue-900/70 rounded-2xl overflow-hidden shadow-2xl">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-950/70 via-indigo-950/50 to-sky-950/70"></div>
                    <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-blue-700/30 via-indigo-700/20 to-slate-700/30 rounded-bl-full animate-pulse"></div>
                    
                    <div className="relative z-10 px-4 py-3">
                      <div className="space-y-3 text-left">
                        <div className="mb-4">
                          <Typography className="text-xs uppercase tracking-widest font-bold bg-gradient-to-r from-blue-300 via-indigo-300 to-slate-300 bg-clip-text text-transparent mb-2">
                            información de contacto
                          </Typography>
                        </div>
                        
                        <div className="space-y-2">
                          <Typography component="p" className="text-sm font-medium bg-gradient-to-r from-blue-100 via-indigo-100 to-slate-200 bg-clip-text  flex items-center justify-start gap-2">
                            <span> Av. Innovación 123, Madrid, España</span>
                          </Typography>
                          <Typography component="p" className="text-sm font-medium bg-gradient-to-r from-blue-100 via-indigo-100 to-slate-200 bg-clip-text  flex items-center justify-start gap-2">
                            <span>+34 (91) 123-4567</span>
                          </Typography>
                          <Typography component="p" className="text-sm font-medium bg-gradient-to-r from-blue-100 via-indigo-100 to-slate-200 bg-clip-text  break-words flex items-center justify-start gap-2">
                            <span>contacto@neosale.es</span>
                          </Typography>
                          <Typography component="p" className="text-sm font-medium bg-gradient-to-r from-blue-100 via-indigo-100 to-slate-200 bg-clip-text  flex items-center justify-start gap-2">
                            <span>www.neosale.es</span>
                          </Typography>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col space-y-6 max-w-xl">
                  {/* Main Title with Enhanced Design */}
                  <div className="relative">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="flex flex-col">
                       
                        <Typography
                          className="text-5xl md:text-5xl font-black uppercase bg-gradient-to-r from-blue-200 via-indigo-200 to-slate-300 bg-clip-text text-transparent tracking-tight print:text-black leading-none drop-shadow-lg"
                          variant="h2"
                        >
                          factura
                        </Typography>
                      </div>
                    </div>
                    <div className="absolute -bottom-2 left-0 w-32 h-1 bg-gradient-to-r from-blue-600 via-indigo-500 to-slate-400 rounded-full animate-pulse shadow-lg"></div>
                  </div>

                  {/* Compact Status Section */}
                  <div className="inline-flex items-center justify-between gap-4 bg-gradient-to-r from-blue-950/50 via-indigo-950/40 to-sky-950/50 px-4 py-2 rounded-full border border-blue-900/70 shadow-lg">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full animate-pulse ${
                        order.status === 'delivered' ? 'bg-green-500' :
                        order.status === 'pending' ? 'bg-yellow-500' :
                        order.status === 'processing' ? 'bg-blue-500' :
                        order.status === 'cancelled' ? 'bg-red-500' :
                        'bg-indigo-500'
                      }`}></div>
                      <Typography className="uppercase font-medium text-xs bg-gradient-to-r from-blue-300 via-indigo-300 to-slate-300 bg-clip-text text-transparent tracking-wide print:text-black">
                        estado
                      </Typography>
                    </div>

                    <Badge
                      variant={
                        OrderBadgeVariants[order.status] as
                        | "default"
                        | "secondary"
                        | "outline"
                        | "destructive"
                        | "success"
                        | "warning"
                        | "processing"
                      }
                      className={`px-3 py-1 text-xs font-semibold capitalize border shadow-md rounded-lg ${
                        order.status === 'delivered' ?
                        'bg-gradient-to-r from-green-900/60 to-emerald-900/60 border-green-600/60 text-green-200' :
                        order.status === 'pending' ?
                        'bg-gradient-to-r from-yellow-900/60 to-amber-900/60 border-yellow-600/60 text-yellow-200' :
                        order.status === 'processing' ?
                        'bg-gradient-to-r from-blue-900/60 to-indigo-900/60 border-blue-600/60 text-blue-200' :
                        order.status === 'cancelled' ?
                        'bg-gradient-to-r from-red-900/60 to-rose-900/60 border-red-600/60 text-red-200' :
                        'bg-gradient-to-r from-indigo-900/60 to-slate-900/60 border-slate-600/60 text-slate-200'
                      }`}
                    >
                      {order.status}
                    </Badge>
                  </div>
                </div>

                {/* Right Side - Enhanced Company Info */}
               
              </div>
            </div>
          </div>

          {/* Enhanced Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 print:flex print:flex-row print:justify-between print:text-black">
            <div className="relative glass-info-card p-6 transition-all duration-300 hover:shadow-lg border border-blue-800/60 rounded-xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-950/30 via-transparent to-blue-900/20"></div>
              <div className="relative z-10">
                <Typography
                  variant="p"
                  component="h4"
                  className="font-bold uppercase text-xs tracking-wide bg-gradient-to-r from-blue-300 to-slate-300 bg-clip-text text-transparent mb-3 print:text-black"
                >
                  fecha emisión
                </Typography>

                <Typography className="text-lg font-semibold text-gray-100 leading-relaxed">
                  {formatDate.long(order.created_at)}
                </Typography>
              </div>
            </div>

            <div className="relative glass-info-card p-6 transition-all duration-300 hover:shadow-lg border border-blue-800/60 rounded-xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-950/25 via-transparent to-slate-900/20"></div>
              <div className="relative z-10">
                <Typography
                  variant="p"
                  component="h4"
                  className="font-bold uppercase text-xs tracking-wide bg-gradient-to-r from-blue-300 to-slate-300 bg-clip-text text-transparent mb-3 print:text-black"
                >
                  número factura
                </Typography>

                <Typography className="text-lg font-semibold text-gray-100 leading-relaxed">
                  #{order.id}
                </Typography>
              </div>
            </div>

            <div className="relative glass-info-card p-6 transition-all duration-300 hover:shadow-lg border border-blue-800/60 rounded-xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-slate-950/25 via-transparent to-blue-950/20"></div>
              <div className="relative z-10">
                <Typography
                  variant="p"
                  component="h4"
                  className="font-bold uppercase text-xs tracking-wide bg-gradient-to-r from-blue-300 to-slate-300 bg-clip-text text-transparent mb-3 print:text-black"
                >
                  cliente facturación
                </Typography>

                <div className="space-y-2">
                  <Typography component="p" className="text-lg font-semibold text-gray-100">
                    {order.User.name}
                  </Typography>
                  <Typography component="p" className="text-sm text-gray-400 font-medium break-words">
                    {order.User.email}
                  </Typography>
                  {order.User.phoneNumber && (
                    <Typography component="p" className="text-sm text-gray-400 font-medium">
                      {order.User.phoneNumber}
                    </Typography>
                  )}
                  {order.addresses?.street && (
                    <Typography component="p" className="text-sm text-gray-400 font-medium max-w-full">
                      {order.addresses.street}, {order.addresses.city}, {order.addresses.zip_code}
                    </Typography>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="glass-table mb-10 print:text-black print:border-print-border">
            <Table>
              <TableHeader>
                <TableRow className="glass-table-header print:border-b-print-border">
                  <TableHead className="uppercase h-12 whitespace-nowrap print:text-black font-bold bg-gradient-to-r from-indigo-400 to-blue-400 bg-clip-text text-transparent text-xs tracking-wider">
                    N.º
                  </TableHead>
                  <TableHead className="uppercase h-12 whitespace-nowrap print:text-black font-bold bg-gradient-to-r from-indigo-400 to-blue-400 bg-clip-text text-transparent text-xs tracking-wider">
                    producto
                  </TableHead>
                  <TableHead className="uppercase h-12 whitespace-nowrap text-center print:text-black font-bold bg-gradient-to-r from-indigo-400 to-blue-400 bg-clip-text text-transparent text-xs tracking-wider">
                    cantidad
                  </TableHead>
                  <TableHead className="uppercase h-12 whitespace-nowrap text-center print:text-black font-bold bg-gradient-to-r from-indigo-400 to-blue-400 bg-clip-text text-transparent text-xs tracking-wider">
                    precio unit.
                  </TableHead>
                  <TableHead className="uppercase h-12 whitespace-nowrap text-right print:text-black font-bold bg-gradient-to-r from-indigo-400 to-blue-400 bg-clip-text text-transparent text-xs tracking-wider">
                    importe
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {order.order_items.map((orderItem, index) => (
                  <TableRow
                    key={`order-item-${index}`}
                    className="glass-table-row print:border-b-print-border"
                  >
                    <TableCell className="py-4 print:font-normal print:text-black font-medium text-slate-header">
                      {index + 1}
                    </TableCell>
                    <TableCell className="font-semibold py-4 px-6 text-slate-200 print:font-normal print:text-black">
                      {orderItem.products.name}
                    </TableCell>
                    <TableCell className="font-semibold py-4 text-center text-slate-custom print:font-normal print:text-black">
                      {orderItem.quantity}
                    </TableCell>
                    <TableCell className="font-semibold py-4 text-center text-slate-custom print:font-normal print:text-black">
                      ${orderItem.price.toFixed(2)}
                    </TableCell>
                    <TableCell className="font-bold py-4 text-gradient-primary text-right print:text-black">
                      ${(orderItem.quantity * orderItem.price).toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 print:flex-row print:justify-between print:mb-0 print:p-0 print:px-2 print:bg-white">
            <div className="relative glass-summary-card p-5 transition-all duration-300 hover:shadow-lg border border-blue-700/50 rounded-lg overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-950/40 via-blue-900/20 to-transparent"></div>
              <div className="relative z-10">
                <Typography
                  component="h4"
                  className="font-semibold text-xs uppercase tracking-wide bg-gradient-to-r from-blue-300 to-slate-300 bg-clip-text text-transparent mb-3 print:text-black"
                >
                  método de pago
                </Typography>

                <Typography className="text-lg font-bold text-gray-100 capitalize print:text-black">
                  {order.payments.payment_method}
                </Typography>
              </div>
            </div>

            <div className="relative glass-summary-card p-5 transition-all duration-300 hover:shadow-lg border border-blue-700/50 rounded-lg overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-slate-950/30 via-blue-950/20 to-transparent"></div>
              <div className="relative z-10">
                <Typography
                  component="h4"
                  className="font-semibold text-xs uppercase tracking-wide bg-gradient-to-r from-blue-300 to-slate-300 bg-clip-text text-transparent mb-3 print:text-black"
                >
                  coste envío
                </Typography>

                <Typography className="text-lg font-bold text-gray-100 print:text-black">
                  ${order.shipping_cost.toFixed(2)}
                </Typography>
              </div>
            </div>

            <div className="relative glass-summary-card p-5 transition-all duration-300 hover:shadow-lg border border-green-700/50 rounded-lg overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-green-950/40 via-emerald-950/20 to-transparent"></div>
              <div className="relative z-10">
                <Typography
                  component="h4"
                  className="font-semibold text-xs uppercase tracking-wide bg-gradient-to-r from-green-300 to-emerald-300 bg-clip-text text-transparent mb-3 print:text-black"
                >
                  descuento
                </Typography>

                <Typography className="text-lg font-bold text-green-400 print:text-black">
                  ${getDiscount({
                    totalAmount: order.total,
                    shippingCost: order.shipping_cost,
                    coupon: order.coupons,
                  })}
                </Typography>
              </div>
            </div>

            <div className="sm:col-span-2 lg:col-span-1">
              <div className="relative glass-total-card p-6 transition-all duration-300 hover:shadow-xl border-2 border-blue-600/70 rounded-xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-900/60 via-blue-950/40 to-slate-900/30"></div>
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-700/30 to-transparent rounded-bl-full"></div>
                <div className="relative z-10">
                  <Typography
                    component="h4"
                    className="font-bold text-sm uppercase tracking-wide bg-gradient-to-r from-blue-200 to-blue-400 bg-clip-text text-transparent mb-2 print:text-black"
                  >
                    total final
                  </Typography>

                  <Typography className="text-3xl font-black text-blue-100 print:text-black mb-2">
                    ${order.total.toFixed(2)}
                  </Typography>
                  
                  <div className="text-xs text-blue-300 font-medium uppercase tracking-wide">
                    Impuestos incluidos
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <ShippingManagement
          orderId={order.id}
          orderStatus={order.status}
          hasGuide={false}
          guideNumber={undefined}
          trackingUrl={undefined}
        />

        <InvoiceActions order={order} />
      </section>
    );
  } catch {
    return notFound();
  }
}
