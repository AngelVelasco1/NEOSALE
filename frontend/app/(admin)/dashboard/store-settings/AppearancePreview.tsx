"use client";

import { Watch } from "lucide-react";
import Image from "next/image";

interface AppearancePreviewProps {
  primaryColor: string;
  secondaryColor: string;
  accentColor?: string;
  logoUrl?: string;
  storeName?: string;
}

export function AppearancePreview({
  primaryColor,
  secondaryColor,
  accentColor,
  logoUrl,
  storeName = "Tu Tienda",
}: AppearancePreviewProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Watch className="w-5 h-5 text-slate-400" />
        <h4 className="text-sm font-medium text-slate-300">Vista Previa</h4>
      </div>

      {/* Mobile Preview */}
      <div className="relative bg-black rounded-3xl p-3 shadow-2xl border border-gray-800 max-w-xs mx-auto">
        {/* Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-7 bg-black rounded-b-3xl"></div>

        {/* Content */}
        <div className="bg-slate-950 rounded-3xl overflow-hidden h-96 flex flex-col">
          {/* Header */}
          <div
            className="p-4 text-white flex items-center justify-between bg-gradient-to-r"
            style={{ 
              backgroundImage: `linear-gradient(to right, ${primaryColor}, ${secondaryColor})` 
            }}
          >
            <div className="flex items-center gap-2">
              {logoUrl && (
                <Image
                  src={logoUrl}
                  alt="Logo"
                  width={32}
                  height={32}
                  className="w-8 h-8 rounded object-contain"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              )}
              <span className="font-bold text-sm">{storeName}</span>
            </div>
          </div>

          {/* Body */}
          <div className="flex-1 p-4 overflow-y-auto bg-slate-950">
            {/* Product Card */}
            <div className="bg-slate-900 rounded-lg p-3 mb-3 border border-slate-800">
              <div
                className="w-full h-20 rounded mb-2"
                style={{ backgroundColor: `${primaryColor}30` }}
              ></div>
              <h3 className="text-xs font-semibold text-gray-200 mb-1">
                Producto de Ejemplo
              </h3>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-300">$99.99</span>
                <button
                  className="text-xs px-2 py-1 rounded text-white font-medium"
                  style={{ backgroundColor: accentColor || primaryColor }}
                >
                  Comprar
                </button>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div
            className="p-3 text-white text-center text-xs"
            style={{ backgroundColor: secondaryColor }}
          >
            © 2024 - Tu Tienda
          </div>
        </div>
      </div>

      {/* Color Chips */}
      <div className="grid grid-cols-3 gap-2 mt-6">
        <div>
          <p className="text-xs text-slate-400 mb-2">Primario</p>
          <div
            className="w-full h-12 rounded-lg border-2 border-slate-700 shadow-lg"
            style={{ backgroundColor: primaryColor }}
          >
            <div className="text-xs text-white p-1 text-center h-full flex items-center justify-center font-mono overflow-hidden">
              {primaryColor}
            </div>
          </div>
        </div>
        <div>
          <p className="text-xs text-slate-400 mb-2">Secundario</p>
          <div
            className="w-full h-12 rounded-lg border-2 border-slate-700 shadow-lg"
            style={{ backgroundColor: secondaryColor }}
          >
            <div className="text-xs text-white p-1 text-center h-full flex items-center justify-center font-mono overflow-hidden">
              {secondaryColor}
            </div>
          </div>
        </div>
        <div>
          <p className="text-xs text-slate-400 mb-2">Acento</p>
          <div
            className="w-full h-12 rounded-lg border-2 border-slate-700 shadow-lg"
            style={{ backgroundColor: accentColor || primaryColor }}
          >
            <div className="text-xs text-white p-1 text-center h-full flex items-center justify-center font-mono overflow-hidden">
              {accentColor || primaryColor}
            </div>
          </div>
        </div>
      </div>

      <p className="text-xs text-slate-500 text-center mt-4">
        Background siempre oscuro
      </p>
    </div>
  );
}
