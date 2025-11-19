"use client";

import { useTransition } from "react";
import { FileJson, FileSpreadsheet } from "lucide-react";

import { toast } from "sonner";
import { Button } from "../../components/ui/button";

import { Database } from "../../types/supabase";
import { exportAsCSV, exportAsJSON } from "../../helpers/exportData";

type SuccessResponse = { data: any[] };
type ErrorResponse = { error: string };
type ActionResponse = SuccessResponse | ErrorResponse;

type Props = {
  tableName: keyof Database["public"]["Tables"];
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
    <div className="flex flex-wrap gap-2">
      <Button
        variant="outline"
        size="default"
        disabled={isPending}
        onClick={() => handleExport("csv")}
        className="h-10 px-4 rounded-lg border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 disabled:opacity-50 transition-all text-sm font-medium"
      >
        <FileSpreadsheet className="mr-2 h-4 w-4 text-emerald-600 dark:text-emerald-400" />
        Exportar CSV
      </Button>

      <Button
        variant="outline"
        size="default"
        disabled={isPending}
        onClick={() => handleExport("json")}
        className="h-10 px-4 rounded-lg border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 disabled:opacity-50 transition-all text-sm font-medium"
      >
        <FileJson className="mr-2 h-4 w-4 text-blue-600 dark:text-blue-400" />
        Exportar JSON
      </Button>
    </div>
  );
}
