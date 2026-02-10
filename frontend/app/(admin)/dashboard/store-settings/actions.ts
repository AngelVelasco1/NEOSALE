"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8000';

const storeSettingsSchema = z.object({
  store_name: z.string().min(1, "El nombre de la tienda es requerido"),
  store_description: z.string().optional(),
  contact_email: z.string().email("Email inválido"),
  contact_phone: z.string().min(1, "El teléfono es requerido"),
  whatsapp_number: z.string().optional(),
  address: z.string().optional(),
  city: z.string().min(1, "La ciudad es requerida"),
  country: z.string().min(1, "El país es requerido"),
  facebook_url: z.string().optional(),
  instagram_url: z.string().optional(),
  twitter_url: z.string().optional(),
  youtube_url: z.string().optional(),
  tiktok_url: z.string().optional(),
  logo_url: z.string().optional(),
  favicon_url: z.string().optional(),
  primary_color: z.string().optional().default("#3B82F6"),
  secondary_color: z.string().optional().default("#6366F1"),
  accent_color: z.string().optional().default("#D946EF"),
  footer_text: z.string().optional(),
  newsletter_enabled: z.boolean().optional(),
  show_whatsapp_chat: z.boolean().optional(),
  seo_title: z.string().optional(),
  seo_description: z.string().optional(),
  seo_keywords: z.string().optional(),
  google_analytics_id: z.string().optional(),
  facebook_pixel_id: z.string().optional(),
});

type StoreSettingsInput = z.infer<typeof storeSettingsSchema>;

export async function getStoreSettings() {
  try {
    const response = await fetch(`${BACKEND_URL}/api/store-settings`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`Backend error: ${response.status}`);
    }

    const data = await response.json();
    return {
      success: true,
      data: data.data || data,
    };
  } catch (error) {
    console.error("Error fetching store settings:", error);
    return {
      success: false,
      error: "Error al obtener la configuración de la tienda",
    };
  }
}

export async function updateStoreSettings(formData: StoreSettingsInput) {
  try {
    // Validar los datos
    const validatedData = storeSettingsSchema.parse({
      ...formData,
      primary_color: formData.primary_color || "#3B82F6",
      secondary_color: formData.secondary_color || "#6366F1",
      accent_color: formData.accent_color || "#D946EF",
    });

    const response = await fetch(`${BACKEND_URL}/api/store-settings`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(validatedData),
    });

    if (!response.ok) {
      throw new Error(`Backend error: ${response.status}`);
    }

    const data = await response.json();

    // Revalidar la ruta para actualizar el caché
    revalidatePath("/dashboard/store-settings");
    revalidatePath("/");

    return {
      success: true,
      data: data.data || data,
      message: "Configuración guardada exitosamente",
    };
  } catch (error) {
    console.error("Error updating store settings:", error);

    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: "Datos inválidos",
        details: error.errors,
      };
    }

    return {
      success: false,
      error: "Error al guardar la configuración",
    };
  }
}
