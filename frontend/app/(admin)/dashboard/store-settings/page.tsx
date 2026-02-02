"use client";

import { useState, useEffect, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { getStoreSettings, updateStoreSettings } from "./actions";
import {
  Store,
  Mail,
  Phone,
  MapPin,
  Globe,
  Save,
  Loader2,
  Settings,
  Palette,

  Users,
  BarChart3,
  Image as ImageIcon,
  ChevronRight,
  CheckCircle,
  AlertCircle,
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

const navigationItems = [
  { id: 'general', label: 'General', icon: Store, description: 'Información básica de la tienda' },
  { id: 'contact', label: 'Contacto', icon: Phone, description: 'Datos de contacto y ubicación' },
  { id: 'social', label: 'Redes Sociales', icon: Users, description: 'Conexión con redes sociales' },
  { id: 'appearance', label: 'Apariencia', icon: Palette, description: 'Colores y branding' },
  { id: 'seo', label: 'SEO', icon: Globe, description: 'Optimización para motores de búsqueda' },
];

// Tipo para los datos que vienen de la base de datos
type StoreSettingsDB = {
  id: number;
  store_name: string;
  store_description: string | null;
  contact_email: string;
  contact_phone: string;
  whatsapp_number: string | null;
  address: string | null;
  city: string;
  country: string;
  facebook_url: string | null;
  instagram_url: string | null;
  twitter_url: string | null;
  youtube_url: string | null;
  tiktok_url: string | null;
  logo_url: string | null;
  favicon_url: string | null;
  primary_color: string;
  secondary_color: string;
  footer_text: string | null;
  newsletter_enabled: boolean;
  show_whatsapp_chat: boolean;
  seo_title: string | null;
  seo_description: string | null;
  seo_keywords: string | null;
  google_analytics_id: string | null;
  facebook_pixel_id: string | null;
  active: boolean;
  created_at: Date;
  updated_at: Date | null;
  updated_by: number | null;
};

// Helper para transformar datos de DB a formato de formulario
const transformDbToForm = (data: StoreSettingsDB): StoreSettingsForm => {
  return {
    store_name: data.store_name,
    store_description: data.store_description ?? undefined,
    contact_email: data.contact_email,
    contact_phone: data.contact_phone,
    whatsapp_number: data.whatsapp_number ?? undefined,
    address: data.address ?? undefined,
    city: data.city,
    country: data.country,
    facebook_url: data.facebook_url ?? undefined,
    instagram_url: data.instagram_url ?? undefined,
    twitter_url: data.twitter_url ?? undefined,
    youtube_url: data.youtube_url ?? undefined,
    tiktok_url: data.tiktok_url ?? undefined,
    logo_url: data.logo_url ?? undefined,
    favicon_url: data.favicon_url ?? undefined,
    primary_color: data.primary_color ?? undefined,
    secondary_color: data.secondary_color ?? undefined,
    footer_text: data.footer_text ?? undefined,
    newsletter_enabled: data.newsletter_enabled ?? undefined,
    show_whatsapp_chat: data.show_whatsapp_chat ?? undefined,
    seo_title: data.seo_title ?? undefined,
    seo_description: data.seo_description ?? undefined,
    seo_keywords: data.seo_keywords ?? undefined,
  };
};

export default function StoreSettingsPage() {
  const [isPending, startTransition] = useTransition();
  const [fetching, setFetching] = useState(true);
  const [activeSection, setActiveSection] = useState('general');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isDirty },
  } = useForm<StoreSettingsForm>({
    resolver: zodResolver(storeSettingsSchema),
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  useEffect(() => {
    setHasUnsavedChanges(isDirty);
  }, [isDirty]);

  const fetchSettings = async () => {
    try {
      setFetching(true);
      const result = await getStoreSettings();
      
      if (result.success && result.data) {
        const formData = transformDbToForm(result.data);
        reset(formData);
      } else {
        toast.error(result.error || "Error al cargar la configuración");
      }
    } catch (error) {
      console.error("Error fetching settings:", error);
      toast.error("Error al cargar la configuración");
    } finally {
      setFetching(false);
    }
  };

  const onSubmit = async (data: StoreSettingsForm) => {
    startTransition(async () => {
      try {
        const result = await updateStoreSettings({
          ...data,
          primary_color: data.primary_color || "#3B82F6",
          secondary_color: data.secondary_color || "#6366F1",
        });

        if (result.success) {
          toast.success(result.message || "Configuración guardada exitosamente");
          setHasUnsavedChanges(false);
          
          // Actualizar el formulario con los datos guardados
          if (result.data) {
            const formData = transformDbToForm(result.data);
            reset(formData);
          }
        } else {
          toast.error(result.error || "Error al guardar la configuración");
          
          if (result.details) {
            console.error("Validation errors:", result.details);
          }
        }
      } catch (error) {
        console.error("Error saving settings:", error);
        toast.error("Error al guardar la configuración");
      }
    });
  };

  if (fetching) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-950">
        <div className="flex items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
          <span className="text-lg text-slate-400">Cargando configuración...</span>
        </div>
      </div>
    );
  }

  const renderSection = () => {
    switch (activeSection) {
      case 'general':
        return (
          <div className="space-y-8">
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 border border-blue-500/20">
                  <Store className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white">Información General</h3>
                  <p className="text-slate-400">Configura los datos básicos de tu tienda</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-slate-300">
                    Nombre de la Tienda <span className="text-red-400">*</span>
                  </label>
                  <input
                    {...register("store_name")}
                    className="w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    placeholder="NeoSale"
                  />
                  {errors.store_name && (
                    <p className="text-sm text-red-400 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.store_name.message}
                    </p>
                  )}
                </div>

                <div className="space-y-3">
                  <label className="block text-sm font-medium text-slate-300">
                    Ciudad <span className="text-red-400">*</span>
                  </label>
                  <input
                    {...register("city")}
                    className="w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    placeholder="Bogotá"
                  />
                  {errors.city && (
                    <p className="text-sm text-red-400 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.city.message}
                    </p>
                  )}
                </div>

                <div className="lg:col-span-2 space-y-3">
                  <label className="block text-sm font-medium text-slate-300">Descripción de la Tienda</label>
                  <textarea
                    {...register("store_description")}
                    rows={4}
                    className="w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none transition-all"
                    placeholder="Describe tu tienda, productos y lo que te hace único..."
                  />
                  <p className="text-xs text-slate-500">Esta descripción aparecerá en la página principal y meta tags</p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'contact':
        return (
          <div className="space-y-8">
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-500/10 border border-green-500/20">
                  <Phone className="w-6 h-6 text-green-400" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white">Información de Contacto</h3>
                  <p className="text-slate-400">Cómo los clientes pueden contactarte</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-slate-300">
                    Email de Contacto <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                    <input
                      {...register("contact_email")}
                      type="email"
                      className="w-full pl-12 pr-4 py-3 rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                      placeholder="info@neosale.com"
                    />
                  </div>
                  {errors.contact_email && (
                    <p className="text-sm text-red-400 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.contact_email.message}
                    </p>
                  )}
                </div>

                <div className="space-y-3">
                  <label className="block text-sm font-medium text-slate-300">
                    Teléfono de Contacto <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                    <input
                      {...register("contact_phone")}
                      className="w-full pl-12 pr-4 py-3 rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                      placeholder="+57 300 123 4567"
                    />
                  </div>
                  {errors.contact_phone && (
                    <p className="text-sm text-red-400 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.contact_phone.message}
                    </p>
                  )}
                </div>

                <div className="space-y-3">
                  <label className="block text-sm font-medium text-slate-300">WhatsApp</label>
                  <div className="relative">
                    <RiWhatsappFill className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500" />
                    <input
                      {...register("whatsapp_number")}
                      className="w-full pl-12 pr-4 py-3 rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                      placeholder="+57 300 123 4567"
                    />
                  </div>
                  <p className="text-xs text-slate-500">Número para soporte al cliente vía WhatsApp</p>
                </div>

                <div className="space-y-3">
                  <label className="block text-sm font-medium text-slate-300">
                    País <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                    <input
                      {...register("country")}
                      className="w-full pl-12 pr-4 py-3 rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                      placeholder="Colombia"
                    />
                  </div>
                  {errors.country && (
                    <p className="text-sm text-red-400 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.country.message}
                    </p>
                  )}
                </div>

                <div className="lg:col-span-2 space-y-3">
                  <label className="block text-sm font-medium text-slate-300">Dirección Física</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-4 w-5 h-5 text-slate-500" />
                    <textarea
                      {...register("address")}
                      rows={3}
                      className="w-full pl-12 pr-4 py-3 rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:ring-2 focus:ring-green-500 focus:border-green-500 resize-none transition-all"
                      placeholder="Cra 7 #71-21, Oficina 501, Bogotá, Colombia"
                    />
                  </div>
                  <p className="text-xs text-slate-500">Dirección completa para envíos y facturación</p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'social':
        return (
          <div className="space-y-8">
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/10 border border-purple-500/20">
                  <Users className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white">Redes Sociales</h3>
                  <p className="text-slate-400">Conecta tus perfiles sociales para aumentar la visibilidad</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-slate-300">Facebook</label>
                  <div className="relative">
                    <RiFacebookCircleFill className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-500" />
                    <input
                      {...register("facebook_url")}
                      className="w-full pl-12 pr-4 py-3 rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                      placeholder="https://facebook.com/tutienda"
                    />
                  </div>
                  {errors.facebook_url && (
                    <p className="text-sm text-red-400 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.facebook_url.message}
                    </p>
                  )}
                </div>

                <div className="space-y-3">
                  <label className="block text-sm font-medium text-slate-300">Instagram</label>
                  <div className="relative">
                    <RiInstagramFill className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-pink-500" />
                    <input
                      {...register("instagram_url")}
                      className="w-full pl-12 pr-4 py-3 rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                      placeholder="https://instagram.com/tutienda"
                    />
                  </div>
                  {errors.instagram_url && (
                    <p className="text-sm text-red-400 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.instagram_url.message}
                    </p>
                  )}
                </div>

                <div className="space-y-3">
                  <label className="block text-sm font-medium text-slate-300">Twitter/X</label>
                  <div className="relative">
                    <RiTwitterXFill className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      {...register("twitter_url")}
                      className="w-full pl-12 pr-4 py-3 rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                      placeholder="https://twitter.com/tutienda"
                    />
                  </div>
                  {errors.twitter_url && (
                    <p className="text-sm text-red-400 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.twitter_url.message}
                    </p>
                  )}
                </div>

                <div className="space-y-3">
                  <label className="block text-sm font-medium text-slate-300">YouTube</label>
                  <div className="relative">
                    <RiYoutubeFill className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-red-500" />
                    <input
                      {...register("youtube_url")}
                      className="w-full pl-12 pr-4 py-3 rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                      placeholder="https://youtube.com/@tutienda"
                    />
                  </div>
                  {errors.youtube_url && (
                    <p className="text-sm text-red-400 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.youtube_url.message}
                    </p>
                  )}
                </div>

                <div className="lg:col-span-2 space-y-3">
                  <label className="block text-sm font-medium text-slate-300">TikTok</label>
                  <div className="relative">
                    <RiTiktokFill className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-cyan-500" />
                    <input
                      {...register("tiktok_url")}
                      className="w-full pl-12 pr-4 py-3 rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                      placeholder="https://tiktok.com/@tutienda"
                    />
                  </div>
                  {errors.tiktok_url && (
                    <p className="text-sm text-red-400 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.tiktok_url.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-8 p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-medium text-white mb-1">Consejo</h4>
                    <p className="text-sm text-slate-400">
                      Las redes sociales conectadas aparecerán automáticamente en el footer de tu tienda y mejorarán tu SEO local.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'appearance':
        return (
          <div className="space-y-8">
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-500/10 border border-orange-500/20">
                  <Palette className="w-6 h-6 text-orange-400" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white">Apariencia y Branding</h3>
                  <p className="text-slate-400">Personaliza los colores y elementos visuales de tu tienda</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-slate-300">Logo URL</label>
                  <div className="relative">
                    <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                    <input
                      {...register("logo_url")}
                      className="w-full pl-12 pr-4 py-3 rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                      placeholder="https://ejemplo.com/logo.png"
                    />
                  </div>
                  <p className="text-xs text-slate-500">URL de tu logo principal (recomendado: 200x60px)</p>
                </div>

                <div className="space-y-3">
                  <label className="block text-sm font-medium text-slate-300">Favicon URL</label>
                  <div className="relative">
                    <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                    <input
                      {...register("favicon_url")}
                      className="w-full pl-12 pr-4 py-3 rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                      placeholder="https://ejemplo.com/favicon.ico"
                    />
                  </div>
                  <p className="text-xs text-slate-500">Ícono que aparece en la pestaña del navegador (32x32px)</p>
                </div>

                <div className="space-y-3">
                  <label className="block text-sm font-medium text-slate-300">Color Primario</label>
                  <div className="relative">
                    <Palette className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                    <input
                      {...register("primary_color")}
                      type="color"
                      className="w-full h-12 pl-12 pr-4 rounded-lg bg-slate-800 border border-slate-700 text-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all cursor-pointer"
                      defaultValue="#3b82f6"
                    />
                  </div>
                  <p className="text-xs text-slate-500">Color principal de botones y elementos destacados</p>
                </div>

                <div className="space-y-3">
                  <label className="block text-sm font-medium text-slate-300">Color Secundario</label>
                  <div className="relative">
                    <Palette className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                    <input
                      {...register("secondary_color")}
                      type="color"
                      className="w-full h-12 pl-12 pr-4 rounded-lg bg-slate-800 border border-slate-700 text-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all cursor-pointer"
                      defaultValue="#64748b"
                    />
                  </div>
                  <p className="text-xs text-slate-500">Color secundario para acentos y elementos complementarios</p>
                </div>

                <div className="lg:col-span-2 space-y-3">
                  <label className="block text-sm font-medium text-slate-300">Texto del Footer</label>
                  <textarea
                    {...register("footer_text")}
                    rows={3}
                    className="w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-none transition-all"
                    placeholder="© 2024 Tu Tienda. Todos los derechos reservados."
                  />
                  <p className="text-xs text-slate-500">Texto que aparecerá en el footer de tu tienda</p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'seo':
        return (
          <div className="space-y-8">
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-500/10 border border-cyan-500/20">
                  <Globe className="w-6 h-6 text-cyan-400" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white">Optimización SEO</h3>
                  <p className="text-slate-400">Mejora tu visibilidad en motores de búsqueda</p>
                </div>
              </div>

              <div className="space-y-8">
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-slate-300">Título SEO</label>
                  <input
                    {...register("seo_title")}
                    className="w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all"
                    placeholder="Tu Tienda - Los mejores productos online"
                  />
                  <div className="flex justify-between items-center mt-2">
                    <p className="text-xs text-slate-500">Óptimo: 50-60 caracteres</p>
                    {(() => {
                      const titleLength = (watch('seo_title') || '').length;
                      return (
                        <span className={`text-xs ${titleLength > 60 ? 'text-red-400' : titleLength > 50 ? 'text-yellow-400' : 'text-green-400'}`}>
                          {titleLength}/60
                        </span>
                      );
                    })()}
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="block text-sm font-medium text-slate-300">Descripción SEO</label>
                  <textarea
                    {...register("seo_description")}
                    rows={4}
                    className="w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 resize-none transition-all"
                    placeholder="Descripción breve y atractiva de tu tienda para aparecer en los resultados de búsqueda"
                  />
                  <div className="flex justify-between items-center mt-2">
                    <p className="text-xs text-slate-500">Óptimo: 150-160 caracteres</p>
                    {(() => {
                      const descLength = (watch('seo_description') || '').length;
                      return (
                        <span className={`text-xs ${descLength > 160 ? 'text-red-400' : descLength > 150 ? 'text-yellow-400' : 'text-green-400'}`}>
                          {descLength}/160
                        </span>
                      );
                    })()}
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="block text-sm font-medium text-slate-300">Palabras Clave</label>
                  <input
                    {...register("seo_keywords")}
                    className="w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all"
                    placeholder="moda, ropa, tendencias, compras online"
                  />
                  <p className="text-xs text-slate-500 mt-2">Separa las palabras clave con comas. Máximo 10 palabras clave.</p>
                </div>
              </div>

              <div className="mt-8 p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                <div className="flex items-start gap-3">
                  <BarChart3 className="w-5 h-5 text-cyan-400 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-medium text-white mb-1">Optimización SEO</h4>
                    <p className="text-sm text-slate-400">
                      Un buen SEO puede aumentar significativamente la visibilidad de tu tienda en los motores de búsqueda.
                      Asegúrate de incluir palabras clave relevantes para tu negocio.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-80 bg-slate-900 border-r border-slate-800 min-h-screen">
          <div className="p-6">
            <div className="flex items-center gap-3 mb-8">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-800 border border-slate-700">
                <Settings className="w-5 h-5 text-slate-300" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-white">Configuración</h1>
                <p className="text-sm text-slate-400">Panel de control avanzado</p>
              </div>
            </div>

            <nav className="space-y-2">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveSection(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all ${
                      activeSection === item.id
                        ? 'bg-slate-800 border border-slate-700 text-white'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${activeSection === item.id ? 'text-blue-400' : ''}`} />
                    <div className="flex-1">
                      <div className="text-sm font-medium">{item.label}</div>
                      <div className="text-xs opacity-70">{item.description}</div>
                    </div>
                    {activeSection === item.id && (
                      <ChevronRight className="w-4 h-4 text-blue-400" />
                    )}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 min-h-screen">
          <div className="p-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-white">
                  {navigationItems.find(item => item.id === activeSection)?.label}
                </h2>
                <p className="text-slate-400 mt-1">
                  {navigationItems.find(item => item.id === activeSection)?.description}
                </p>
              </div>

              {hasUnsavedChanges && (
                <div className="flex items-center gap-2 px-3 py-2 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                  <AlertCircle className="w-4 h-4 text-yellow-400" />
                  <span className="text-sm text-yellow-400">Cambios sin guardar</span>
                </div>
              )}
            </div>

            <form onSubmit={handleSubmit(onSubmit)}>
              {renderSection()}

              {/* Save Button */}
              <div className="flex justify-end mt-8 pt-6 border-t border-slate-800">
                <button
                  type="submit"
                  disabled={isPending}
                  className="inline-flex items-center gap-3 px-6 py-3 rounded-lg bg-linear-to-r from-blue-600 to-blue-700 text-white font-medium hover:from-blue-700 hover:to-blue-800 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-950 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-blue-500/20"
                >
                  {isPending ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Guardando...
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      Guardar Configuración
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Footer */}
            <div className="mt-12 text-center">
              <p className="text-slate-500 text-sm">
                Los cambios se aplicarán inmediatamente en tu tienda online
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
