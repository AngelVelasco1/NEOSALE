import { Printer } from "lucide-react";
import { useRouter } from "next/navigation";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../../../components/ui/tooltip";
import { Button } from "../../../../components/ui/button";

export function PrintInvoiceButton({ orderId }: { orderId: string }) {
  const router = useRouter();

  const handlePrint = () => {
    // Navegar a la página de detalles con parámetro para auto-imprimir
    router.push(`/dashboard/orders/${orderId}?print=true`);
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            onClick={handlePrint}
            className="text-foreground"
          >
            <Printer className="size-5" />
          </Button>
        </TooltipTrigger>

        <TooltipContent>
          <p>Print Invoice</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
