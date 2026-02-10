import { prisma } from "../lib/prisma";

export const getStoreSettingsService = async () => {
  const settings = await prisma.storeSettings.findFirst({
    where: { active: true },
  });

  if (!settings) {
    // Return default settings if none exist
    return {
      id: 0,
      store_name: "NeoSale",
      contact_email: "info@neosale.com",
      contact_phone: "+57 300 123 4567",
      city: "Bogotá",
      country: "Colombia",
      primary_color: "#3B82F6",
      secondary_color: "#6366F1",
      accent_color: "#D946EF",
      newsletter_enabled: true,
      show_whatsapp_chat: true,
    };
  }

  return settings;
};

export const updateStoreSettingsService = async (data: any) => {
  const settings = await prisma.storeSettings.upsert({
    where: { id: 1 },
    create: data,
    update: {
      ...data,
      updated_at: new Date(),
    },
  });

  return settings;
};

export const getStoreColorsService = async () => {
  const settings = await prisma.storeSettings.findFirst({
    where: { active: true },
    select: {
      primary_color: true,
      secondary_color: true,
      accent_color: true,
    },
  });

  return (
    settings || {
      primary_color: "#3B82F6",
      secondary_color: "#6366F1",
      accent_color: "#D946EF",
    }
  );
};
