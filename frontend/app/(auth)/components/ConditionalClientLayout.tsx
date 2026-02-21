"use client";

import React, { ReactNode, useRef } from "react";
import { Navbar } from "../../components/Navbar";
import { useUserSafe } from "../hooks/useUserSafe";

export function ConditionalClientLayout({ children }: { children: ReactNode }) {
    const { userProfile, isLoading } = useUserSafe();
    const renderCount = useRef(0);
    renderCount.current++;

    // Mientras carga el usuario, mostrar children directamente para evitar delay
    if (isLoading) {
        return <>{children}</>;
    }

    if (userProfile?.role === "admin") {
        return <>{children}</>;
    }

    return (
        <div className="min-h-screen w-full flex flex-col font-inter">
            <Navbar />
            <main className="grow">{children}</main>
        </div>
    );
}
