"use client";

import { useSession } from "next-auth/react";
import { useEffect, useRef } from "react";

export function SessionDebugger() {
  const { data: session, status } = useSession();
  const renderCount = useRef(0);
  
  useEffect(() => {
    renderCount.current += 1;
    console.log(`[SessionDebugger] Render #${renderCount.current}`);
    console.log(`[SessionDebugger] Status: ${status}`);
    console.log(`[SessionDebugger] Session:`, JSON.stringify(session, null, 2));
  }, [session, status]);
  
  if (process.env.NODE_ENV !== 'production') {
    return (
      <div className="fixed bottom-4 right-4 bg-black/90 text-white p-4 rounded-lg text-xs max-w-md z-50 font-mono">
        <div className="font-bold mb-2">Session Debug</div>
        <div>Render count: {renderCount.current}</div>
        <div>Status: <span className={status === "authenticated" ? "text-green-400" : "text-yellow-400"}>{status}</span></div>
        <div>User ID: {session?.user?.id || "N/A"}</div>
        <div>Role: {session?.user?.role || "N/A"}</div>
        <div>Email: {session?.user?.email || "N/A"}</div>
      </div>
    );
  }
  
  return null;
}
