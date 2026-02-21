"use client";

import { DownloadCloud, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { usePdfDownload } from "@/app/(admin)/hooks/use-pdf-download";
import { OrderDetails } from "@/app/(admin)/services/orders/types";
import InvoicePdfTemplate from "./InvoicePdfTemplate";

export function InvoiceActions({ order }: { order: OrderDetails }) {
  const { isLoading, downloadTemplate } = usePdfDownload();

  const printInvoice = () => {
    window.print();
  };

  const downloadInvoice = () => {
    downloadTemplate({
      htmlId: `invoice-${order.id}`,
      pdfName: `Invoice-${order.id}`,
    });
  };

  return (
    <>
      <div className="flex flex-wrap gap-4 justify-center print:hidden mb-8">
        <Button 
          size="lg" 
          disabled={isLoading} 
          onClick={downloadInvoice} 
          className="relative group overflow-hidden px-5 py-6 bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 hover:from-blue-700 hover:via-blue-800 hover:to-blue-900 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] border border-blue-500/30 backdrop-blur-sm"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-white/10 via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="absolute inset-0 bg-blue-400/20 rounded-xl blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-500"></div>
          <div className="relative z-10 flex items-center">
            <span className="bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent font-bold text-base tracking-wide">
              {isLoading ? "Generando Factura..." : "Descargar Factura"}
            </span>
            {isLoading ? (
              <Loader2 className="ml-3 size-5 animate-spin text-white drop-shadow-sm" />
            ) : (
              <DownloadCloud className="ml-3 size-5 text-white drop-shadow-sm group-hover:animate-pulse" />
            )}
          </div>
        </Button>
      </div>

      <div className="absolute -z-[1] opacity-0 -top-[9999px] -left-[9999px]">
        <InvoicePdfTemplate order={order} />
      </div>
    </>
  );
}
