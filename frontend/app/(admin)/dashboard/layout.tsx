import { Sidebar } from "./components/sidebar";
import { Providers } from "../providers";
import { Header } from "./components/header";
import type { Metadata } from "next";
import type { PropsWithChildren } from "react";
import { auth } from "../../(auth)/auth";

export const metadata: Metadata = {
  title: {
    template: "Admin Dashboard",
    default: "NeoSale Admin Dashboard",
  },
  description:
    "Administra tu tienda de ecommerce con NeoSale, la plataforma que te permite gestionar productos, pedidos y clientes de manera eficiente.",
};

export default async function DashboardLayout({ children }: PropsWithChildren) {
  const session = await auth();
  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <h2 className="text-slate-900 text-2xl font-semibold mb-2">
              Acceso Requerido
            </h2>
            <p className="text-slate-600 mb-6">
              Debes iniciar sesión para acceder al dashboard
            </p>
            <a
              href="/login"
              className="inline-flex items-center justify-center w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Iniciar Sesión
            </a>
          </div>
        </div>
      </div>
    );
  }
  if (session?.user?.role !== "admin") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 text-center">
            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-amber-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <h2 className="text-slate-900 text-2xl font-semibold mb-2">
              Acceso Denegado
            </h2>
            <p className="text-slate-600 mb-6">
              Solo los administradores pueden acceder a esta área
            </p>
            <a
              href="/"
              className="inline-flex items-center justify-center w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Volver al Inicio
            </a>
          </div>
        </div>
      </div>
    );
  }
  return (
    <Providers>
      <div className="flex min-h-screen">
        <Sidebar />

        <div className="w-full bg-gray-2 dark:bg-[#020d1a]">
          <Header />

          <main className="isolate mx-auto w-full max-w-screen-2xl overflow-hidden p-4 md:p-6 2xl:p-10">
            {children}
          </main>
        </div>
      </div>
    </Providers>
  );
}
