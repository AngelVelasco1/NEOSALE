import { Metadata } from "next";

import EditProfileForm from "./_components/EditProfileForm";

export const metadata: Metadata = {
  title: "Edit Profile",
};

// Auth protection: proxy.ts ensures user has session, RoleGuard ensures admin role
// Fetch profile data client-side in EditProfileForm to avoid blocking server render
export default function EditProfilePage() {
  return (
    <section className="relative min-h-screen py-2">
      {/* Modern gradient background */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-linear-to-br from-slate-900 via-slate-900 to-slate-800" />
        
        {/* Subtle floating lights */}
        <div className="absolute top-20 right-20 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-32 left-20 w-80 h-80 bg-purple-500/8 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-cyan-500/6 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      </div>

      <div className="max-w-5xl mx-auto px-2 sm:px-2 space-y-6">
        <EditProfileForm />
      </div>
    </section>
  );
}
