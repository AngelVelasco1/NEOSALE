import { useState, useTransition, type ReactNode } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { AlertTriangle } from "lucide-react";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../../../components/ui/alert-dialog";
import { toast } from "sonner";
import { AlertDialogTooltip } from "./TableActionTooltip";
import { FormSubmitButton } from "../form/FormSubmitButton";
import { ServerActionResponse } from "../../../types/server-action";

type Props = {
  title: string;
  description: string;
  tooltipContent: string;
  actionButtonText: string;
  toastSuccessMessage: string;
  queryKey: string;
  children: ReactNode;
  action: () => Promise<ServerActionResponse>;
};

export function TableActionAlertDialog({
  title,
  description,
  tooltipContent,
  actionButtonText,
  toastSuccessMessage,
  queryKey,
  children,
  action,
}: Props) {
  const queryClient = useQueryClient();
  const [isPending, startTransition] = useTransition();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleConfirm = () => {
    startTransition(async () => {
      const result = await action();

      if ("dbError" in result) {
        toast.error(result.dbError);
      } else {
        toast.success(toastSuccessMessage, { position: "top-center" });
        queryClient.invalidateQueries({ queryKey: [queryKey] });
        setIsDialogOpen(false);
      }
    });
  };

  return (
    <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <AlertDialogTooltip content={tooltipContent}>
        {children}
      </AlertDialogTooltip>

      <AlertDialogContent className="bg-linear-to-br from-slate-900 via-slate-900 to-slate-800 border-slate-700/50 backdrop-blur-xl shadow-2xl max-w-md">
        <AlertDialogHeader className="mb-6 space-y-4">
          <div className="flex items-center justify-center w-16 h-16 mx-auto bg-linear-to-br from-red-500/20 to-orange-500/20 rounded-2xl border border-red-500/30 shadow-lg shadow-red-500/10">
            <AlertTriangle className="w-8 h-8 text-red-400" />
          </div>

          <AlertDialogTitle className="text-2xl font-bold text-center bg-linear-to-r from-white to-slate-300 bg-clip-text text-transparent">
            {title}
          </AlertDialogTitle>

          <AlertDialogDescription className="text-center text-slate-400 leading-relaxed text-base">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className="gap-3 sm:gap-3">
          <AlertDialogCancel className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-600/50 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]">
            Cancelar
          </AlertDialogCancel>
          <FormSubmitButton
            variant="destructive"
            isPending={isPending}
            onClick={handleConfirm}
            className="flex-1 bg-linear-to-r from-red-700 to-red-800 hover:from-red-900 hover:to-red-900 text-white font-semibold  transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] border-0"
          >
            {actionButtonText}
          </FormSubmitButton>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
