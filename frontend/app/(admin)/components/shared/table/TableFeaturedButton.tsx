import { useState, useTransition } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Star } from "lucide-react";

import { toast } from "sonner";
import { ServerActionResponse } from "../../../types/server-action";

type Props = {
    couponId: number;
    initialFeatured: boolean;
    queryKey: string;
    onToggle: (couponId: number, currentFeatured: boolean) => Promise<ServerActionResponse>;
};

export function TableFeaturedButton({
    couponId,
    initialFeatured,
    queryKey,
    onToggle,
}: Props) {
    const queryClient = useQueryClient();
    const [isFeatured, setIsFeatured] = useState(initialFeatured);
    const [isPending, startTransition] = useTransition();

    const handleToggle = () => {
        // Actualización optimista - cambiar UI inmediatamente
        const previousState = isFeatured;
        setIsFeatured(!isFeatured);

        // Ejecutar la actualización en segundo plano
        startTransition(async () => {
            const result = await onToggle(couponId, previousState);

            if ("dbError" in result) {
                // Revertir si hay error
                setIsFeatured(previousState);
                toast.error("Error al actualizar cupón destacado");
            } else {
                toast.success(
                    !previousState ? "Cupón destacado en banner" : "Cupón removido del banner",
                    { position: "top-center" }
                );
                // Invalidar queries para sincronizar
                queryClient.invalidateQueries({ queryKey: [queryKey] });
            }
        });
    };

    return (
        <div className="relative group">
            <button
                onClick={handleToggle}
                disabled={isPending}
                className={`p-2 rounded-lg transition-all ${isFeatured
                        ? "text-yellow-500 hover:text-yellow-600 bg-yellow-50 dark:bg-yellow-950/30"
                        : "text-slate-400 hover:text-yellow-500 hover:bg-yellow-50 dark:hover:bg-yellow-950/30"
                    } ${isPending ? "opacity-50 cursor-wait" : "cursor-pointer"}`}
                title="Destacar en Banner"
            >
                <Star
                    className={`size-5 transition-transform ${isPending ? "animate-pulse" : ""}`}
                    fill={isFeatured ? "currentColor" : "none"}
                />
            </button>
            <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-slate-900 dark:bg-slate-700 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
                {isFeatured ? "Quitar de banner" : "Destacar en banner"}
            </span>
        </div>
    );
}
