"use client";

import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

interface SortableHeaderProps {
    label: string;
    sortKey: string;
}

export function SortableHeader({ label, sortKey }: SortableHeaderProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const currentSortBy = searchParams.get("sortBy");
    const currentSortOrder = searchParams.get("sortOrder");

    const isActive = currentSortBy === sortKey;
    const isAsc = isActive && currentSortOrder === "asc";
    const isDesc = isActive && currentSortOrder === "desc";

    const handleSort = () => {
        const params = new URLSearchParams(searchParams.toString());

        if (!isActive) {
            // No está activo, activar con orden ascendente
            params.set("sortBy", sortKey);
            params.set("sortOrder", "asc");
        } else if (isAsc) {
            // Está ascendente, cambiar a descendente
            params.set("sortOrder", "desc");
        } else {
            // Está descendente, quitar ordenamiento
            params.delete("sortBy");
            params.delete("sortOrder");
        }

        router.push(`?${params.toString()}`, { scroll: false });
    };

    return (
        <button
            onClick={handleSort}
            className="flex items-center gap-2 hover:text-blue-400 transition-colors font-semibold"
        >
            {label}
            {!isActive && <ArrowUpDown className="h-4 w-4 opacity-50" />}
            {isAsc && <ArrowUp className="h-4 w-4 text-blue-400" />}
            {isDesc && <ArrowDown className="h-4 w-4 text-blue-400" />}
        </button>
    );
}
