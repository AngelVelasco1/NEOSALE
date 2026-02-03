"use client";

import { NotFound } from "./(admin)/components/shared/NotFound";
import { usePathname } from "next/navigation";

export default function NotFoundPage() {
  const pathname = usePathname().slice(1);
  
  return (
          <NotFound page={pathname} />
  );
}
