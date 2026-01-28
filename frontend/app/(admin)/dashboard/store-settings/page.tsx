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
  Palette,
  Image as ImageIcon,
  Save,
  Loader2,
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
      <div className="flex items-center justify-center min-h-screen bg-slate-950">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Store className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">
                Personalizar Tienda
              </h1>
              <p className="text-gray-400">
                Configura la información y apariencia de tu tienda
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Información General */}
          <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl shadow-2xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <Store className="w-6 h-6 text-blue-500" />
              <h2 className="text-xl font-bold text-white">
                Información General
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Nombre de la Tienda *
                </label>
                <input
                  {...register("store_name")}
                  className="w-full px-4 py-3 rounded-lg bg-slate-800/50 border border-slate-700 text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="NeoSale"
                />
                {errors.store_name && (
                  <p className="text-red-400 text-sm mt-1">
                    {errors.store_name.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Ciudad *
                </label>
                <input
                  {...register("city")}
                  className="w-full px-4 py-3 rounded-lg bg-slate-800/50 border border-slate-700 text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Bogotá"
                />
                {errors.city && (
                  <p className="text-red-400 text-sm mt-1">
                    {errors.city.message}
                  </p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Descripción
                </label>
                <textarea
                  {...register("store_description")}
                  rows={3}
                  className="w-full px-4 py-3 rounded-lg bg-slate-800/50 border border-slate-700 text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all"
                  placeholder="Describe tu tienda..."
                />
              </div>
            </div>
          </div>

          {/* Información de Contacto */}
          <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl shadow-2xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <Phone className="w-6 h-6 text-blue-500" />
              <h2 className="text-xl font-bold text-white">
                Información de Contacto
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Email de Contacto *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    {...register("contact_email")}
                    type="email"
                    className="w-full pl-11 pr-4 py-3 rounded-lg bg-slate-800/50 border border-slate-700 text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="info@neosale.com"
                  />
                </div>
                {errors.contact_email && (
                  <p className="text-red-400 text-sm mt-1">
                    {errors.contact_email.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Teléfono de Contacto *
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    {...register("contact_phone")}
                    className="w-full pl-11 pr-4 py-3 rounded-lg bg-slate-800/50 border border-slate-700 text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="+57 300 123 4567"
                  />
                </div>
                {errors.contact_phone && (
                  <p className="text-red-400 text-sm mt-1">
                    {errors.contact_phone.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  WhatsApp
                </label>
                <div className="relative">
                  <RiWhatsappFill className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    {...register("whatsapp_number")}
                    className="w-full pl-11 pr-4 py-3 rounded-lg bg-slate-800/50 border border-slate-700 text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="+57 300 123 4567"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  País *
                </label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    {...register("country")}
                    className="w-full pl-11 pr-4 py-3 rounded-lg bg-slate-800/50 border border-slate-700 text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Colombia"
                  />
                </div>
                {errors.country && (
                  <p className="text-red-400 text-sm mt-1">
                    {errors.country.message}
                  </p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Dirección
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-500" />
                  <textarea
                    {...register("address")}
                    rows={2}
                    className="w-full pl-11 pr-4 py-3 rounded-lg bg-slate-800/50 border border-slate-700 text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all"
                    placeholder="Cra 7 #71-21, Oficina 501"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Redes Sociales */}
          <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl shadow-2xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <RiInstagramFill className="w-6 h-6 text-blue-500" />
              <h2 className="text-xl font-bold text-white">Redes Sociales</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Facebook
                </label>
                <div className="relative">
                  <RiFacebookCircleFill className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    {...register("facebook_url")}
                    className="w-full pl-11 pr-4 py-3 rounded-lg bg-slate-800/50 border border-slate-700 text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="https://facebook.com/..."
                  />
                </div>
                {errors.facebook_url && (
                  <p className="text-red-400 text-sm mt-1">
                    {errors.facebook_url.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Instagram
                </label>
                <div className="relative">
                  <RiInstagramFill className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    {...register("instagram_url")}
                    className="w-full pl-11 pr-4 py-3 rounded-lg bg-slate-800/50 border border-slate-700 text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="https://instagram.com/..."
                  />
                </div>
                {errors.instagram_url && (
                  <p className="text-red-400 text-sm mt-1">
                    {errors.instagram_url.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Twitter/X
                </label>
                <div className="relative">
                  <RiTwitterXFill className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    {...register("twitter_url")}
                    className="w-full pl-11 pr-4 py-3 rounded-lg bg-slate-800/50 border border-slate-700 text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="https://twitter.com/..."
                  />
                </div>
                {errors.twitter_url && (
                  <p className="text-red-400 text-sm mt-1">
                    {errors.twitter_url.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  YouTube
                </label>
                <div className="relative">
                  <RiYoutubeFill className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    {...register("youtube_url")}
                    className="w-full pl-11 pr-4 py-3 rounded-lg bg-slate-800/50 border border-slate-700 text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="https://youtube.com/..."
                  />
                </div>
                {errors.youtube_url && (
                  <p className="text-red-400 text-sm mt-1">
                    {errors.youtube_url.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  TikTok
                </label>
                <div className="relative">
                  <RiTiktokFill className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    {...register("tiktok_url")}
                    className="w-full pl-11 pr-4 py-3 rounded-lg bg-slate-800/50 border border-slate-700 text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="https://tiktok.com/@..."
                  />
                </div>
                {errors.tiktok_url && (
                  <p className="text-red-400 text-sm mt-1">
                    {errors.tiktok_url.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* SEO */}
          <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl shadow-2xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <Globe className="w-6 h-6 text-blue-500" />
              <h2 className="text-xl font-bold text-white">SEO</h2>
            </div>

            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Título SEO
                </label>
                <input
                  {...register("seo_title")}
                  className="w-full px-4 py-3 rounded-lg bg-slate-800/50 border border-slate-700 text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Título para motores de búsqueda"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Descripción SEO
                </label>
                <textarea
                  {...register("seo_description")}
                  rows={2}
                  className="w-full px-4 py-3 rounded-lg bg-slate-800/50 border border-slate-700 text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all"
                  placeholder="Descripción para motores de búsqueda"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Palabras Clave SEO
                </label>
                <input
                  {...register("seo_keywords")}
                  className="w-full px-4 py-3 rounded-lg bg-slate-800/50 border border-slate-700 text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="moda, ropa, tendencias"
                />
              </div>
            </div>
          </div>

          {/* Botón Guardar */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Save className="w-5 h-5" />
              )}
              {loading ? "Guardando..." : "Guardar Configuración"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
