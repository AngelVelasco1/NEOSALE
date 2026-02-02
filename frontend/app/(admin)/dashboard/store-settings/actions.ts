"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

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
    // Obtener la primera configuración activa o crear una por defecto
    let settings = await prisma.storeSettings.findFirst({
      where: { active: true },
      orderBy: { id: "asc" },
    });

    // Si no existe ninguna configuración, crear una por defecto
    if (!settings) {
      settings = await prisma.storeSettings.create({
        data: {
          store_name: "NeoSale",
          store_description: "Tu tienda online de confianza",
          contact_email: "info@neosale.com",
          contact_phone: "+57 300 123 4567",
          city: "Bogotá",
          country: "Colombia",
          primary_color: "#3B82F6",
          secondary_color: "#6366F1",
          newsletter_enabled: true,
          show_whatsapp_chat: true,
          active: true,
        },
      });
    }

    return {
      success: true,
      data: settings,
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
    });

    // Buscar la configuración existente
    const existingSettings = await prisma.storeSettings.findFirst({
      where: { active: true },
      orderBy: { id: "asc" },
    });

    let settings;
    
    if (existingSettings) {
      // Actualizar la configuración existente
      settings = await prisma.storeSettings.update({
        where: { id: existingSettings.id },
        data: {
          ...validatedData,
          updated_at: new Date(),
        },
      });
    } else {
      // Crear nueva configuración si no existe
      settings = await prisma.storeSettings.create({
        data: {
          ...validatedData,
          active: true,
        },
      });
    }

    // Revalidar la ruta para actualizar el caché
    revalidatePath("/dashboard/store-settings");
    revalidatePath("/");

    return {
      success: true,
      data: settings,
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
