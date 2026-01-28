"use client";

import { useTransition } from "react";
import { FileJson, FileSpreadsheet } from "lucide-react";

import { toast } from "sonner";
import { Button } from "../../components/ui/button";

import { exportAsCSV, exportAsJSON } from "../../helpers/exportData";

type SuccessResponse = { data: any[] };
type ErrorResponse = { error: string };
type ActionResponse = SuccessResponse | ErrorResponse;

type Props = {
  tableName: string;
  action: () => Promise<ActionResponse>;
};

export function ExportDataButtons({ tableName, action }: Props) {
  const [isPending, startTransition] = useTransition();

  const handleExport = (format: "json" | "csv") => {
    toast.info(`Exporting ${tableName} as ${format.toUpperCase()}...`);

    startTransition(async () => {
      const result = await action();

      if ("error" in result) {
        toast.error(result.error);
      } else if ("data" in result) {
        if (format === "json") {
          exportAsJSON(result.data, tableName);
        } else if (format === "csv") {
          exportAsCSV(result.data, tableName);
        }
      }
    });
  };

  return (
    <div className="flex flex-col sm:flex-row gap-2">
      <Button
        variant="outline"
        size="default"
        disabled={isPending}
        onClick={() => handleExport("csv")}
        className="h-11 px-4 rounded-xl border-white/20 bg-white/10 text-white/90 shadow-[0_12px_30px_-14px_rgba(34,197,235,0.55)] backdrop-blur transition-all hover:border-emerald-200/50 hover:bg-emerald-400/10 hover:text-white disabled:opacity-50 text-sm font-semibold"
      >
        <FileSpreadsheet className="mr-2 h-4 w-4 text-emerald-300" />
        Exportar CSV
      </Button>

      <Button
        variant="outline"
        size="default"
        disabled={isPending}
        onClick={() => handleExport("json")}
        className="h-11 px-4 rounded-xl border-white/20 bg-white/10 text-white/90 shadow-[0_12px_30px_-14px_rgba(79,70,229,0.55)] backdrop-blur transition-all hover:border-cyan-200/50 hover:bg-cyan-400/10 hover:text-white disabled:opacity-50 text-sm font-semibold"
      >
        <FileJson className="mr-2 h-4 w-4 text-blue-300" />
        Exportar JSON
      </Button>
    </div>
  );
}
