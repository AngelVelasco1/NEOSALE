"use client";

import { UserProviders } from "@/app/providers/UserProviders";
import { Navbar } from "../components/Navbar";
import { useMounted } from "@/app/(auth)/hooks/useMounted";
import { useSession } from "next-auth/react";
import React from "react";
import dynamic from "next/dynamic";

// Dynamic imports para reducir bundle inicial
const Footer = dynamic(() => import("../components/FooterDynamic").then(mod => ({ default: mod.Footer })), {
  ssr: true,
});

const CouponBanner = dynamic(() => import("./components/CouponBanner"), {
  ssr: false,
  loading: () => null,
});

const EmailVerificationBanner = dynamic(() => import("../components/EmailVerificationBanner").then(mod => ({ default: mod.EmailVerificationBanner })), {
  ssr: false,
});

const CookieConsent = dynamic(() => import("../components/CookieConsent").then(mod => ({ default: mod.CookieConsent })), {
  ssr: false,
});

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const mounted = useMounted();
  const { data: session } = useSession();

  if (!mounted) {
    return (
      <div className="flex flex-col min-h-screen font-montserrat @container mx-auto">
        <nav className="sticky top-0 z-50 w-full b bg-white/95 backdrop-blur">
          <div className="container mx-auto flex h-18 items-center justify-between px-4">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-blue-600 rounded"></div>
              <span className="text-xl font-bold">NeoSale</span>
            </div>
            <div className="flex-1 max-w-xl mx-8">
              <div className="w-full h-10 bg-gray-200 rounded animate-pulse"></div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-gray-200 rounded animate-pulse"></div>
              <div className="w-8 h-8 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
        </nav>
      </div>
    );
  }

  return (

    <UserProviders>
      <div className="flex flex-col min-h-screen w-full font-montserrat bg-linear-to-br from-slate-900 via-slate-900 to-slate-900">
        {session?.user && !session.user.emailVerified && (
          <EmailVerificationBanner userEmail={session.user.email || ''} />
        )}
        <CouponBanner />
        <Navbar />
        <main className="grow">{children}</main>
        <Footer />
        <CookieConsent />
      </div>
    </UserProviders>
  );
}
