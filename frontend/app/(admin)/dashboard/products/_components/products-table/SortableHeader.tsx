"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { Button } from "@/app/(admin)/components/ui/button";

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

        // Toggle sort order: none -> asc -> desc -> none
        if (!isActive || isDesc) {
            params.set("sortBy", sortKey);
            params.set("sortOrder", "asc");
        } else if (isAsc) {
            params.set("sortBy", sortKey);
            params.set("sortOrder", "desc");
        } else {
            params.delete("sortBy");
            params.delete("sortOrder");
        }

        // Reset to page 1 when sorting
        params.set("page", "1");

        router.push(`/dashboard/products?${params.toString()}`, { scroll: false });
    };

    return (
        <Button
            variant="ghost"
            onClick={handleSort}
            className="h-8 px-2 hover:bg-slate-100 dark:hover:bg-slate-800"
        >
            <span className="font-semibold">{label}</span>
            {!isActive && <ArrowUpDown className="ml-2 h-4 w-4 text-slate-400" />}
            {isAsc && <ArrowUp className="ml-2 h-4 w-4 text-blue-600 dark:text-blue-400" />}
            {isDesc && <ArrowDown className="ml-2 h-4 w-4 text-blue-600 dark:text-blue-400" />}
        </Button>
    );
}
