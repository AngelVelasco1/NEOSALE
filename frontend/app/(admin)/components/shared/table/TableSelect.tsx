import { useTransition } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { ServerActionResponse } from "@/types/server-action";

type Props = {
  value: string;
  toastSuccessMessage: string;
  queryKey: string;
  children: React.ReactNode;
  onValueChange: (value: string) => Promise<ServerActionResponse>;
};

export function TableSelect({
  value,
  toastSuccessMessage,
  queryKey,
  children,
  onValueChange,
}: Props) {
  const queryClient = useQueryClient();
  const [isPending, startTransition] = useTransition();

  const handleValueChange = (newValue: string) => {
    startTransition(async () => {
      const result = await onValueChange(newValue);

      if ("dbError" in result) {
        toast.error(result.dbError);
      } else {
        toast.success(toastSuccessMessage, { position: "top-center" });
        queryClient.invalidateQueries({ queryKey: [queryKey] });
      }
    });
  };

  return (
    <Select
      disabled={isPending}
      value={value}
      onValueChange={handleValueChange}
    >
      <SelectTrigger 
        className="capitalize min-w-32 h-9 rounded-xl bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 hover:border-indigo-500/50 hover:bg-slate-800/70 transition-all duration-300 text-slate-100 focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500/50 disabled:opacity-50 disabled:cursor-not-allowed group"
      >
        <div className="flex items-center gap-2 w-full">
          {isPending ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin text-indigo-400 shrink-0" />
          ) : null}
          <SelectValue 
            placeholder={value}
            className="text-sm font-medium"
          />
        </div>
      </SelectTrigger>

      <SelectContent 
        className="rounded-xl bg-slate-900/95 backdrop-blur-xl border border-slate-700/50 shadow-2xl shadow-slate-950/50 min-w-32"
      >
        {children}
      </SelectContent>
    </Select>
  );
}
