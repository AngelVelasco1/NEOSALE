"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import {
  Store,
  Mail,
  Phone,
  MapPin,
  Globe,
  Image as ImageIcon,
  Save,
  Loader2,
  Sparkles,
} from "lucide-react";
import { RiFacebookCircleFill, RiInstagramFill, RiYoutubeFill, RiTwitterXFill, RiWhatsappFill, RiTiktokFill } from "react-icons/ri";

const storeSettingsSchema = z.object({
  store_name: z.string().min(1, "El nombre de la tienda es requerido"),
  store_description: z.string().optional(),
  contact_email: z.string().email("Email inválido"),
  contact_phone: z.string().min(1, "El teléfono es requerido"),
  whatsapp_number: z.string().optional(),
  address: z.string().optional(),
  city: z.string().min(1, "La ciudad es requerida"),
  country: z.string().min(1, "El país es requerido"),
  facebook_url: z.string().url("URL inválida").optional().or(z.literal("")),
  instagram_url: z.string().url("URL inválida").optional().or(z.literal("")),
  twitter_url: z.string().url("URL inválida").optional().or(z.literal("")),
  youtube_url: z.string().url("URL inválida").optional().or(z.literal("")),
  tiktok_url: z.string().url("URL inválida").optional().or(z.literal("")),
  logo_url: z.string().optional(),
  favicon_url: z.string().optional(),
  primary_color: z.string().optional(),
  secondary_color: z.string().optional(),
  footer_text: z.string().optional(),
  newsletter_enabled: z.boolean().optional(),
  show_whatsapp_chat: z.boolean().optional(),
  seo_title: z.string().optional(),
  seo_description: z.string().optional(),
  seo_keywords: z.string().optional(),
});

type StoreSettingsForm = z.infer<typeof storeSettingsSchema>;

export default function StoreSettingsPage() {
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<StoreSettingsForm>({
    resolver: zodResolver(storeSettingsSchema),
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setFetching(true);
      const response = await fetch("/api/store-settings");
      if (response.ok) {
        const data = await response.json();
        reset(data);
      }
    } catch (error) {
      console.error("Error fetching settings:", error);
      toast.error("Error al cargar la configuración");
    } finally {
      setFetching(false);
    }
  };

  const onSubmit = async (data: StoreSettingsForm) => {
    try {
      setLoading(true);
      const response = await fetch("/api/store-settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        toast.success("Configuración guardada exitosamente");
      } else {
        toast.error("Error al guardar la configuración");
      }
    } catch (error) {
      console.error("Error saving settings:", error);
      toast.error("Error al guardar la configuración");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0a0b14]">
        <div className="relative">
          <div className="absolute inset-0 blur-3xl bg-gradient-to-r from-blue-600/30 to-purple-600/30 rounded-full" />
          <Loader2 className="relative w-10 h-10 animate-spin text-blue-400" />
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden  bg-transparent">
 

      <div className="container relative z-10 mx-auto px-4 py-12 max-w-7xl">
        {/* Header */}
        <div className="mb-12 animate-fade-in">
          <div className="flex items-start gap-6">
            <div className="relative group">
              <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 via-blue-500 to-indigo-600 shadow-2xl transition-transform duration-300 group-hover:scale-105">
                <Store className="w-8 h-8 text-white" strokeWidth={2.5} />
              </div>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-sky-200 via-blue-200 to-cyan-200 bg-clip-text text-transparent">
                  Personalización de Tienda
                </h1>
                <Sparkles className="w-6 h-6 text-cyan-300" />
              </div>
              <p className="text-gray-400 text-lg font-light">
                Configura la identidad visual y datos de contacto de tu negocio
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Información General */}
          <div className="group relative">
            <div className="absolute -inset-px bg-gradient-to-r from-blue-500/50 to-purple-500/50 rounded-3xl opacity-0 group-hover:opacity-100 blur transition-opacity duration-500" />
            <div className="relative bg-gradient-to-br from-slate-900/90 to-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-3xl shadow-2xl p-8 transition-all duration-300 hover:border-slate-600/50">
              <div className="flex items-center gap-4 mb-8">
                <div className="p-2.5 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl border border-blue-500/30">
                  <Store className="w-6 h-6 text-blue-400" strokeWidth={2} />
                </div>
                <h2 className="text-2xl font-bold text-white">
                  Información General
                </h2>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="lg:col-span-1">
                  <label className="block text-sm font-semibold text-gray-300 mb-3">
                    Nombre de la Tienda <span className="text-red-400">*</span>
                  </label>
                  <input
                    {...register("store_name")}
                    className="w-full px-5 py-3.5 rounded-xl bg-slate-800/80 border border-slate-700/70 text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 focus:bg-slate-800 transition-all duration-200 outline-none"
                    placeholder="NeoSale"
                  />
                  {errors.store_name && (
                    <p className="text-red-400 text-sm mt-2 flex items-center gap-1">
                      <span className="inline-block w-1 h-1 rounded-full bg-red-400" />
                      {errors.store_name.message}
                    </p>
                  )}
                </div>

                <div className="lg:col-span-1">
                  <label className="block text-sm font-semibold text-gray-300 mb-3">
                    Ciudad <span className="text-red-400">*</span>
                  </label>
                  <input
                    {...register("city")}
                    className="w-full px-5 py-3.5 rounded-xl bg-slate-800/80 border border-slate-700/70 text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 focus:bg-slate-800 transition-all duration-200 outline-none"
                    placeholder="Bogotá"
                  />
                  {errors.city && (
                    <p className="text-red-400 text-sm mt-2 flex items-center gap-1">
                      <span className="inline-block w-1 h-1 rounded-full bg-red-400" />
                      {errors.city.message}
                    </p>
                  )}
                </div>

                <div className="lg:col-span-2">
                  <label className="block text-sm font-semibold text-gray-300 mb-3">
                    Descripción de la Tienda
                  </label>
                  <textarea
                    {...register("store_description")}
                    rows={4}
                    className="w-full px-5 py-3.5 rounded-xl bg-slate-800/80 border border-slate-700/70 text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 focus:bg-slate-800 resize-none transition-all duration-200 outline-none"
                    placeholder="Describe tu tienda, productos y lo que te hace único..."
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Información de Contacto */}
          <div className="group relative">
            <div className="absolute -inset-px bg-gradient-to-r from-purple-500/50 to-indigo-500/50 rounded-3xl opacity-0 group-hover:opacity-100 blur transition-opacity duration-500" />
            <div className="relative bg-gradient-to-br from-slate-900/90 to-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-3xl shadow-2xl p-8 transition-all duration-300 hover:border-slate-600/50">
              <div className="flex items-center gap-4 mb-8">
                <div className="p-2.5 bg-gradient-to-br from-purple-500/20 to-indigo-500/20 rounded-xl border border-purple-500/30">
                  <Phone className="w-6 h-6 text-purple-400" strokeWidth={2} />
                </div>
                <h2 className="text-2xl font-bold text-white">
                  Información de Contacto
                </h2>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-3">
                    Email de Contacto <span className="text-red-400">*</span>
                  </label>
                  <div className="relative group/input">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within/input:text-purple-400 transition-colors" />
                    <input
                      {...register("contact_email")}
                      type="email"
                      className="w-full pl-12 pr-5 py-3.5 rounded-xl bg-slate-800/80 border border-slate-700/70 text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 focus:bg-slate-800 transition-all duration-200 outline-none"
                      placeholder="info@neosale.com"
                    />
                  </div>
                  {errors.contact_email && (
                    <p className="text-red-400 text-sm mt-2 flex items-center gap-1">
                      <span className="inline-block w-1 h-1 rounded-full bg-red-400" />
                      {errors.contact_email.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-3">
                    Teléfono de Contacto <span className="text-red-400">*</span>
                  </label>
                  <div className="relative group/input">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within/input:text-purple-400 transition-colors" />
                    <input
                      {...register("contact_phone")}
                      className="w-full pl-12 pr-5 py-3.5 rounded-xl bg-slate-800/80 border border-slate-700/70 text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 focus:bg-slate-800 transition-all duration-200 outline-none"
                      placeholder="+57 300 123 4567"
                    />
                  </div>
                  {errors.contact_phone && (
                    <p className="text-red-400 text-sm mt-2 flex items-center gap-1">
                      <span className="inline-block w-1 h-1 rounded-full bg-red-400" />
                      {errors.contact_phone.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-3">
                    WhatsApp
                  </label>
                  <div className="relative group/input">
                    <RiWhatsappFill className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within/input:text-green-400 transition-colors" />
                    <input
                      {...register("whatsapp_number")}
                      className="w-full pl-12 pr-5 py-3.5 rounded-xl bg-slate-800/80 border border-slate-700/70 text-white placeholder-gray-500 focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 focus:bg-slate-800 transition-all duration-200 outline-none"
                      placeholder="+57 300 123 4567"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-3">
                    País <span className="text-red-400">*</span>
                  </label>
                  <div className="relative group/input">
                    <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within/input:text-purple-400 transition-colors" />
                    <input
                      {...register("country")}
                      className="w-full pl-12 pr-5 py-3.5 rounded-xl bg-slate-800/80 border border-slate-700/70 text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 focus:bg-slate-800 transition-all duration-200 outline-none"
                      placeholder="Colombia"
                    />
                  </div>
                  {errors.country && (
                    <p className="text-red-400 text-sm mt-2 flex items-center gap-1">
                      <span className="inline-block w-1 h-1 rounded-full bg-red-400" />
                      {errors.country.message}
                    </p>
                  )}
                </div>

                <div className="lg:col-span-2">
                  <label className="block text-sm font-semibold text-gray-300 mb-3">
                    Dirección Física
                  </label>
                  <div className="relative group/input">
                    <MapPin className="absolute left-4 top-4 w-5 h-5 text-gray-500 group-focus-within/input:text-purple-400 transition-colors" />
                    <textarea
                      {...register("address")}
                      rows={2}
                      className="w-full pl-12 pr-5 py-3.5 rounded-xl bg-slate-800/80 border border-slate-700/70 text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 focus:bg-slate-800 resize-none transition-all duration-200 outline-none"
                      placeholder="Cra 7 #71-21, Oficina 501"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Redes Sociales */}
          <div className="group relative">
            <div className="absolute -inset-px bg-gradient-to-r from-indigo-500/50 to-pink-500/50 rounded-3xl opacity-0 group-hover:opacity-100 blur transition-opacity duration-500" />
            <div className="relative bg-gradient-to-br from-slate-900/90 to-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-3xl shadow-2xl p-8 transition-all duration-300 hover:border-slate-600/50">
              <div className="flex items-center gap-4 mb-8">
                <div className="p-2.5 bg-gradient-to-br from-indigo-500/20 to-pink-500/20 rounded-xl border border-indigo-500/30">
                  <RiInstagramFill className="w-6 h-6 text-indigo-400" />
                </div>
                <h2 className="text-2xl font-bold text-white">Redes Sociales</h2>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-3">
                    Facebook
                  </label>
                  <div className="relative group/input">
                    <RiFacebookCircleFill className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within/input:text-blue-400 transition-colors" />
                    <input
                      {...register("facebook_url")}
                      className="w-full pl-12 pr-5 py-3.5 rounded-xl bg-slate-800/80 border border-slate-700/70 text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 focus:bg-slate-800 transition-all duration-200 outline-none"
                      placeholder="https://facebook.com/tutienda"
                    />
                  </div>
                  {errors.facebook_url && (
                    <p className="text-red-400 text-sm mt-2 flex items-center gap-1">
                      <span className="inline-block w-1 h-1 rounded-full bg-red-400" />
                      {errors.facebook_url.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-3">
                    Instagram
                  </label>
                  <div className="relative group/input">
                    <RiInstagramFill className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within/input:text-pink-400 transition-colors" />
                    <input
                      {...register("instagram_url")}
                      className="w-full pl-12 pr-5 py-3.5 rounded-xl bg-slate-800/80 border border-slate-700/70 text-white placeholder-gray-500 focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500/50 focus:bg-slate-800 transition-all duration-200 outline-none"
                      placeholder="https://instagram.com/tutienda"
                    />
                  </div>
                  {errors.instagram_url && (
                    <p className="text-red-400 text-sm mt-2 flex items-center gap-1">
                      <span className="inline-block w-1 h-1 rounded-full bg-red-400" />
                      {errors.instagram_url.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-3">
                    Twitter/X
                  </label>
                  <div className="relative group/input">
                    <RiTwitterXFill className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within/input:text-gray-300 transition-colors" />
                    <input
                      {...register("twitter_url")}
                      className="w-full pl-12 pr-5 py-3.5 rounded-xl bg-slate-800/80 border border-slate-700/70 text-white placeholder-gray-500 focus:ring-2 focus:ring-gray-500/50 focus:border-gray-500/50 focus:bg-slate-800 transition-all duration-200 outline-none"
                      placeholder="https://twitter.com/tutienda"
                    />
                  </div>
                  {errors.twitter_url && (
                    <p className="text-red-400 text-sm mt-2 flex items-center gap-1">
                      <span className="inline-block w-1 h-1 rounded-full bg-red-400" />
                      {errors.twitter_url.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-3">
                    YouTube
                  </label>
                  <div className="relative group/input">
                    <RiYoutubeFill className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within/input:text-red-400 transition-colors" />
                    <input
                      {...register("youtube_url")}
                      className="w-full pl-12 pr-5 py-3.5 rounded-xl bg-slate-800/80 border border-slate-700/70 text-white placeholder-gray-500 focus:ring-2 focus:ring-red-500/50 focus:border-red-500/50 focus:bg-slate-800 transition-all duration-200 outline-none"
                      placeholder="https://youtube.com/@tutienda"
                    />
                  </div>
                  {errors.youtube_url && (
                    <p className="text-red-400 text-sm mt-2 flex items-center gap-1">
                      <span className="inline-block w-1 h-1 rounded-full bg-red-400" />
                      {errors.youtube_url.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-3">
                    TikTok
                  </label>
                  <div className="relative group/input">
                    <RiTiktokFill className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within/input:text-cyan-400 transition-colors" />
                    <input
                      {...register("tiktok_url")}
                      className="w-full pl-12 pr-5 py-3.5 rounded-xl bg-slate-800/80 border border-slate-700/70 text-white placeholder-gray-500 focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 focus:bg-slate-800 transition-all duration-200 outline-none"
                      placeholder="https://tiktok.com/@tutienda"
                    />
                  </div>
                  {errors.tiktok_url && (
                    <p className="text-red-400 text-sm mt-2 flex items-center gap-1">
                      <span className="inline-block w-1 h-1 rounded-full bg-red-400" />
                      {errors.tiktok_url.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* SEO */}
          <div className="group relative">
            <div className="absolute -inset-px bg-gradient-to-r from-cyan-500/50 to-blue-500/50 rounded-3xl opacity-0 group-hover:opacity-100 blur transition-opacity duration-500" />
            <div className="relative bg-gradient-to-br from-slate-900/90 to-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-3xl shadow-2xl p-8 transition-all duration-300 hover:border-slate-600/50">
              <div className="flex items-center gap-4 mb-8">
                <div className="p-2.5 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-xl border border-cyan-500/30">
                  <Globe className="w-6 h-6 text-cyan-400" strokeWidth={2} />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-white">
                    Optimización SEO
                  </h2>
                  <p className="text-sm text-gray-400 mt-1">
                    Mejora tu visibilidad en motores de búsqueda
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-3">
                    Título SEO
                  </label>
                  <input
                    {...register("seo_title")}
                    className="w-full px-5 py-3.5 rounded-xl bg-slate-800/80 border border-slate-700/70 text-white placeholder-gray-500 focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 focus:bg-slate-800 transition-all duration-200 outline-none"
                    placeholder="Tu Tienda - Los mejores productos online"
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    Óptimo: 50-60 caracteres
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-3">
                    Descripción SEO
                  </label>
                  <textarea
                    {...register("seo_description")}
                    rows={3}
                    className="w-full px-5 py-3.5 rounded-xl bg-slate-800/80 border border-slate-700/70 text-white placeholder-gray-500 focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 focus:bg-slate-800 resize-none transition-all duration-200 outline-none"
                    placeholder="Descripción breve y atractiva de tu tienda para aparecer en los resultados de búsqueda"
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    Óptimo: 150-160 caracteres
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-3">
                    Palabras Clave
                  </label>
                  <input
                    {...register("seo_keywords")}
                    className="w-full px-5 py-3.5 rounded-xl bg-slate-800/80 border border-slate-700/70 text-white placeholder-gray-500 focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 focus:bg-slate-800 transition-all duration-200 outline-none"
                    placeholder="moda, ropa, tendencias, compras online"
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    Separa las palabras clave con comas
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Botón Guardar - Sticky at bottom */}
          <div className="sticky bottom-6 z-20 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="group relative px-8 py-4 rounded-xl font-semibold text-white shadow-2xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-xl opacity-100 group-hover:opacity-90 transition-opacity" />
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity" />
              <div className="relative flex items-center gap-3">
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Guardando cambios...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    <span>Guardar Configuración</span>
                  </>
                )}
              </div>
            </button>
          </div>
        </form>

        {/* Footer info */}
        <div className="mt-12 text-center">
          <p className="text-gray-500 text-sm">
            Los cambios se aplicarán inmediatamente en tu tienda
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
      `}</style>
    </div>
  );
}