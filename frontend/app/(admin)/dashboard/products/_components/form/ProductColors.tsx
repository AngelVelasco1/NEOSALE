"use client";

import { useState } from "react";
import { Plus, X, Upload } from "lucide-react";
import { Button } from "@/app/(admin)/components/ui/button";
import { Input } from "@/app/(admin)/components/ui/input";
import { Label } from "@/app/(admin)/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/(admin)/components/ui/tabs";
import { toast } from "sonner";

interface ColorData {
  name: string;
  code: string;
}

interface ProductColorsProps {
  colors: Array<ColorData>;
  setColors: React.Dispatch<React.SetStateAction<Array<ColorData>>>;
  colorImages: Record<string, Array<{ file: File; preview: string; isPrimary: boolean }>>;
  setColorImages: React.Dispatch<React.SetStateAction<Record<string, Array<{ file: File; preview: string; isPrimary: boolean }>>>>;
  activeColorTab: string | null;
  setActiveColorTab: React.Dispatch<React.SetStateAction<string | null>>;
}

export function ProductColors({
  colors,
  setColors,
  colorImages,
  setColorImages,
  activeColorTab,
  setActiveColorTab
}: ProductColorsProps) {
  const [newColorName, setNewColorName] = useState("");
  const [newColorCode, setNewColorCode] = useState("#000000");

  const addColor = () => {
    if (!newColorName.trim()) {
      toast.error("El nombre del color es requerido");
      return;
    }

    if (colors.some(c => c.code === newColorCode)) {
      toast.error("Ya existe un color con ese código");
      return;
    }

    const newColor = { name: newColorName.trim(), code: newColorCode };
    setColors(prev => [...prev, newColor]);
    setNewColorName("");
    setNewColorCode("#000000");
    setActiveColorTab(newColorCode);
    toast.success(`Color "${newColorName}" agregado`);
  };

  const removeColor = (colorCode: string) => {
    setColors(prev => prev.filter(c => c.code !== colorCode));
    // Limpiar imágenes del color eliminado
    setColorImages(prev => {
      const newImages = { ...prev };
      delete newImages[colorCode];
      return newImages;
    });
    if (activeColorTab === colorCode) {
      setActiveColorTab(colors[0]?.code || null);
    }
    toast.success("Color eliminado");
  };

  const handleImageUpload = (colorCode: string, files: FileList | null) => {
    if (!files || files.length === 0) return;

    const newImages = Array.from(files).map(file => ({
      file,
      preview: URL.createObjectURL(file),
      isPrimary: false
    }));

    setColorImages(prev => {
      const existing = prev[colorCode] || [];
      return {
        ...prev,
        [colorCode]: [...existing, ...newImages]
      };
    });
  };

  const removeImage = (colorCode: string, index: number) => {
    setColorImages(prev => {
      const images = prev[colorCode] || [];
      const newImages = images.filter((_, i) => i !== index);
      return {
        ...prev,
        [colorCode]: newImages
      };
    });
  };

  const setPrimaryImage = (colorCode: string, index: number) => {
    setColorImages(prev => {
      const images = prev[colorCode] || [];
      const newImages = images.map((img, i) => ({
        ...img,
        isPrimary: i === index
      }));
      return {
        ...prev,
        [colorCode]: newImages
      };
    });
  };

  return (
    <div className="space-y-5">
      {/* Agregar nuevo color */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-800/60 bg-linear-to-br from-slate-950/85 via-slate-900/70 to-slate-950/85 p-6 shadow-[0_25px_60px_rgba(2,6,23,0.7)]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.12),transparent_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,_rgba(147,51,234,0.15),transparent_60%)]" />
        <div className="relative flex flex-col gap-5">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <Label className="text-xs font-semibold tracking-[0.25em] text-blue-300/70 uppercase">
                Agregar Color
              </Label>
              <p className="text-base font-semibold text-slate-100 mt-1">
                Define paletas únicas para cada variante
              </p>
              <p className="text-sm text-slate-400">
                Asigna un nombre elegante y un código hex para mantener el catálogo consistente.
              </p>
            </div>
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/70 border border-slate-700/60 text-xs font-semibold text-slate-300">
              <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
              {colors.length} colores activos
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            <div className="lg:col-span-6">
              <Input
                value={newColorName}
                onChange={(e) => setNewColorName(e.target.value)}
                placeholder="Nombre del color (ej: Obsidiana Eléctrica)"
                className="h-12 rounded-xl border-slate-700/60 bg-slate-900/70 text-slate-100 placeholder:text-slate-500 focus-visible:ring-2 focus-visible:ring-blue-500/40"
              />
            </div>
            <div className="lg:col-span-4">
              <div className="relative h-12 rounded-xl border border-slate-700/60 bg-slate-900/70 overflow-hidden flex items-center">
                <input
                  type="color"
                  value={newColorCode}
                  onChange={(e) => setNewColorCode(e.target.value)}
                  className="absolute inset-0 z-20 w-full h-full opacity-0 cursor-pointer"
                />
                <div
                  className="absolute inset-y-0 left-0 w-20"
                  style={{ backgroundColor: newColorCode }}
                />
                <div className="relative flex-1 flex items-center justify-between px-4">
                  <span className="text-xs font-mono tracking-wide text-slate-200">
                    {newColorCode}
                  </span>
                  <span className="text-xs font-semibold text-slate-400" >
                    HEX
                  </span>
                </div>
              </div>
            </div>
            <div className="lg:col-span-2 flex">
              <Button
                type="button"
                onClick={addColor}
                className="w-full h-12 rounded-xl bg-linear-to-r from-blue-600 via-indigo-500 to-purple-600 text-white font-semibold tracking-wide shadow-[0_20px_35px_rgba(37,99,235,0.35)] hover:opacity-90 transition"
              >
                <Plus className="h-4 w-4 mr-2" />
                Añadir
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Lista de colores agregados */}
      {colors.length > 0 && (
        <div className="space-y-4">
          <div>
            <Label className="text-xs font-semibold tracking-[0.3em] text-blue-200/70 uppercase">
              Paleta activa ({colors.length})
            </Label>
            <p className="text-sm text-slate-400">
              Administra imágenes, color primario y elimina variantes sin perder consistencia visual.
            </p>
          </div>
          
          <Tabs value={activeColorTab || undefined} onValueChange={setActiveColorTab}>
            <TabsList className="w-full justify-start overflow-x-auto rounded-2xl bg-slate-950/70 border border-slate-800/70 p-1 backdrop-blur">
              {colors.map((color) => (
                <TabsTrigger
                  key={color.code}
                  value={color.code}
                  className="group relative flex items-center gap-3 rounded-xl px-4 py-2 text-sm font-semibold text-slate-400 transition-all data-[state=active]:text-blue-100 data-[state=active]:shadow-[0_8px_25px_rgba(37,99,235,0.25)]"
                >
                  <div
                    className="w-4 h-4 rounded-lg border border-white/20 shadow-inner shadow-black/30"
                    style={{ backgroundColor: color.code }}
                  />
                  <div className="text-left">
                    <p>{color.name}</p>
                    <span className="text-[11px] font-mono text-slate-500">
                      {color.code}
                    </span>
                  </div>
                  <div className="absolute inset-0 rounded-xl border border-transparent group-data-[state=active]:border-blue-500/40 group-data-[state=active]:bg-linear-to-r group-data-[state=active]:from-blue-500/20 group-data-[state=active]:to-purple-600/20 -z-10" />
                </TabsTrigger>
              ))}
            </TabsList>

            {colors.map((color) => (
              <TabsContent key={color.code} value={color.code} className="pt-6">
                <div className="relative overflow-hidden rounded-2xl border border-slate-800/70 bg-linear-to-br from-slate-950/90 via-slate-900/75 to-slate-950/90 p-6 shadow-[0_25px_60px_rgba(2,6,23,0.6)] space-y-6">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(79,70,229,0.12),transparent_60%)]" />
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,_rgba(14,165,233,0.12),transparent_65%)]" />

                  <div className="relative flex flex-wrap items-center gap-4 justify-between">
                    <div className="flex items-center gap-4">
                      <div
                        className="w-12 h-12 rounded-2xl border border-white/20 shadow-lg shadow-black/40"
                        style={{ backgroundColor: color.code }}
                      />
                      <div>
                        <p className="text-lg font-semibold text-slate-100">{color.name}</p>
                        <p className="text-xs font-mono text-slate-400">{color.code}</p>
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => removeColor(color.code)}
                      className="text-red-300 hover:text-red-200 hover:bg-red-500/15"
                    >
                      <X className="h-4 w-4 mr-2" /> Quitar color
                    </Button>
                  </div>

                  <div className="relative space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-sm font-semibold text-slate-100">
                          Imágenes para {color.name}
                        </Label>
                        <p className="text-xs text-slate-500">Define fotos específicas por color para mejorar la experiencia del cliente.</p>
                      </div>
                      <span className="text-[11px] uppercase tracking-[0.3em] text-slate-500">
                        {colorImages[color.code]?.length || 0} archivos
                      </span>
                    </div>

                    {/* Upload button */}
                    <label className="flex flex-col items-center justify-center h-36 border-2 border-dashed border-slate-700/60 rounded-2xl cursor-pointer bg-slate-900/60 hover:border-blue-400/60 hover:bg-slate-900/80 transition-all">
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={(e) => handleImageUpload(color.code, e.target.files)}
                        className="hidden"
                      />
                      <div className="h-12 w-12 rounded-full bg-blue-500/10 border border-blue-500/30 flex items-center justify-center mb-3">
                        <Upload className="h-6 w-6 text-blue-300" />
                      </div>
                      <p className="text-sm font-medium text-slate-200">Sube imágenes</p>
                      <p className="text-xs text-slate-500">PNG o JPG de hasta 5MB</p>
                    </label>

                    {/* Image grid */}
                    {colorImages[color.code] && colorImages[color.code].length > 0 && (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {colorImages[color.code].map((img, index) => (
                          <div
                            key={index}
                            className="relative group aspect-square rounded-2xl overflow-hidden border border-slate-700/60 shadow-lg shadow-black/40"
                          >
                            <img
                              src={img.preview}
                              alt={`${color.name} - ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                            {img.isPrimary && (
                              <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-linear-to-r from-emerald-500 to-teal-400 text-white text-[11px] font-semibold">
                                Principal
                              </div>
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-3 px-3 text-center">
                              {!img.isPrimary && (
                                <Button
                                  type="button"
                                  size="sm"
                                  onClick={() => setPrimaryImage(color.code, index)}
                                  className="h-8 px-4 rounded-full bg-linear-to-r from-blue-600 to-purple-600 text-white text-xs"
                                >
                                  Marcar principal
                                </Button>
                              )}
                              <Button
                                type="button"
                                size="icon"
                                variant="destructive"
                                onClick={() => removeImage(color.code, index)}
                                className="h-8 w-8 rounded-full"
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      )}
    </div>
  );
}
