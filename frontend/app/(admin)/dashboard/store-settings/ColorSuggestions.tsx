"use client";

import { Palette } from "lucide-react";

interface ColorPaletteOption {
  name: string;
  primary: string;
  secondary: string;
  accent: string;
  description: string;
}

const colorPalettes: ColorPaletteOption[] = [
  {
    name: "Azul Profesional",
    primary: "#3b82f6",
    secondary: "#0ea5e9",
    accent: "#06b6d4",
    description: "Confiable y moderno",
  },
  {
    name: "Púrpura Elegancia",
    primary: "#8b5cf6",
    secondary: "#a855f7",
    accent: "#d946ef",
    description: "Premium y sofisticado",
  },
  {
    name: "Fuchsia Vibrante",
    primary: "#ec4899",
    secondary: "#f43f5e",
    accent: "#fb7185",
    description: "Dinámico y moderno",
  },
  {
    name: "Indigo Corporativo",
    primary: "#4f46e5",
    secondary: "#6366f1",
    accent: "#818cf8",
    description: "Profesional y confiable",
  },
  {
    name: "Verde Naturaleza",
    primary: "#10b981",
    secondary: "#14b8a6",
    accent: "#06b6d4",
    description: "Ecológico y fresco",
  },
  {
    name: "Naranja Energía",
    primary: "#f97316",
    secondary: "#fb923c",
    accent: "#fbbf24",
    description: "Llamativo y energético",
  },
];

interface ColorSuggestionsProps {
  onSelectPalette: (primary: string, secondary: string, accent: string) => void;
}

export function ColorSuggestions({ onSelectPalette }: ColorSuggestionsProps) {
  return (
    <div className="space-y-4 mt-8 pt-8 border-t border-slate-700">
      <div className="flex items-center gap-2">
        <Palette className="w-5 h-5 text-slate-400" />
        <h4 className="text-sm font-semibold text-slate-300">Paletas Sugeridas</h4>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {colorPalettes.map((palette) => (
          <button
            key={palette.name}
            onClick={() => onSelectPalette(palette.primary, palette.secondary, palette.accent)}
            className="group relative overflow-hidden rounded-lg p-4 bg-slate-800/50 border border-slate-700 hover:border-slate-600 transition-all text-left"
          >
            {/* Color Preview */}
            <div className="flex gap-2 mb-3">
              <div
                className="w-6 h-6 rounded-md shadow-lg"
                style={{ backgroundColor: palette.primary }}
              />
              <div
                className="w-6 h-6 rounded-md shadow-lg"
                style={{ backgroundColor: palette.secondary }}
              />
              <div
                className="w-6 h-6 rounded-md shadow-lg"
                style={{ backgroundColor: palette.accent }}
              />
            </div>

            {/* Text */}
            <p className="text-sm font-medium text-white group-hover:text-blue-300 transition-colors">
              {palette.name}
            </p>
            <p className="text-xs text-slate-400 mt-1">{palette.description}</p>

            {/* Hover Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/0 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
        ))}
      </div>

      <p className="text-xs text-slate-500 mt-4">
        💡 Haz clic en cualquier paleta para aplicarla instantáneamente. El background siempre permanecerá oscuro.
      </p>
    </div>
  );
}
