import { useEffect, useState } from "react";

export type StoreSettings = {
  store_name: string;
  store_description?: string;
  contact_email: string;
  contact_phone: string;
  city: string;
  country: string;
  facebook_url?: string;
  instagram_url?: string;
  twitter_url?: string;
  youtube_url?: string;
  tiktok_url?: string;
  whatsapp_number?: string;
  footer_text?: string;
  logo_url?: string;
  favicon_url?: string;
};

export function useStoreSettings() {
  const [settings, setSettings] = useState<StoreSettings | null>(null);

  useEffect(() => {
    fetch("/api/store-settings")
      .then((res) => res.json())
      .then(setSettings)
      .catch(() => setSettings(null));
  }, []);

  return settings;
}
