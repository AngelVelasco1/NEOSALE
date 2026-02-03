"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SortableHeaderProps {
    column: string;
    label: string;
}

export default function SortableHeader({ column, label }: SortableHeaderProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const currentSortBy = searchParams.get("sortBy");
    const currentSortOrder = searchParams.get("sortOrder");

    const isActive = currentSortBy === column;
    const isAsc = isActive && currentSortOrder === "asc";
    const isDesc = isActive && currentSortOrder === "desc";

    const handleSort = () => {
        const params = new URLSearchParams(searchParams.toString());

        if (!isActive) {
            params.set("sortBy", column);
            params.set("sortOrder", "asc");
        } else if (isAsc) {
            params.set("sortOrder", "desc");
        } else {
            params.delete("sortBy");
            params.delete("sortOrder");
        }

        params.set("page", "1");
        router.push(`/dashboard/coupons?${params.toString()}`, { scroll: false });
    };

    return (
        <Button
            variant="ghost"
            onClick={handleSort}
            className="h-8 px-2 hover:bg-slate-800"
        >
            {label}
            {!isActive && <ArrowUpDown className="ml-2 h-4 w-4" />}
            {isAsc && <ArrowUp className="ml-2 h-4 w-4 text-blue-400" />}
            {isDesc && <ArrowDown className="ml-2 h-4 w-4 text-blue-400" />}
        </Button>
    );
}
