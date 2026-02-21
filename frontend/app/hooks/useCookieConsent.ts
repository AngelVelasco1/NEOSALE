"use client";

import { useState, useEffect } from "react";

export interface CookiePreferences {
  necessary: boolean;
  functional: boolean;
  analytics: boolean;
  marketing: boolean;
}

const COOKIE_CONSENT_KEY = "neosale_cookie_consent";
const COOKIE_PREFERENCES_KEY = "neosale_cookie_preferences";

export function useCookieConsent() {
  const [hasConsent, setHasConsent] = useState<boolean | null>(null);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true, // Always true
    functional: false,
    analytics: false,
    marketing: false,
  });
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Check if user has already given consent
    const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
    const savedPreferences = localStorage.getItem(COOKIE_PREFERENCES_KEY);

    if (consent === "true") {
      setHasConsent(true);
      if (savedPreferences) {
        try {
          setPreferences(JSON.parse(savedPreferences));
        } catch (e) {
          
        }
      }
    } else if (consent === "false") {
      setHasConsent(false);
    } else {
      // No consent given yet, show banner after a short delay
      setTimeout(() => setShowBanner(true), 1000);
    }
  }, []);

  const acceptAll = () => {
    const allAccepted: CookiePreferences = {
      necessary: true,
      functional: true,
      analytics: true,
      marketing: true,
    };
    
    localStorage.setItem(COOKIE_CONSENT_KEY, "true");
    localStorage.setItem(COOKIE_PREFERENCES_KEY, JSON.stringify(allAccepted));
    setHasConsent(true);
    setPreferences(allAccepted);
    setShowBanner(false);
  };

  const rejectAll = () => {
    const onlyNecessary: CookiePreferences = {
      necessary: true,
      functional: false,
      analytics: false,
      marketing: false,
    };
    
    localStorage.setItem(COOKIE_CONSENT_KEY, "false");
    localStorage.setItem(COOKIE_PREFERENCES_KEY, JSON.stringify(onlyNecessary));
    setHasConsent(false);
    setPreferences(onlyNecessary);
    setShowBanner(false);
  };

  const savePreferences = (newPreferences: CookiePreferences) => {
    const finalPreferences = { ...newPreferences, necessary: true };
    localStorage.setItem(COOKIE_CONSENT_KEY, "true");
    localStorage.setItem(COOKIE_PREFERENCES_KEY, JSON.stringify(finalPreferences));
    setHasConsent(true);
    setPreferences(finalPreferences);
    setShowBanner(false);
  };

  const resetConsent = () => {
    localStorage.removeItem(COOKIE_CONSENT_KEY);
    localStorage.removeItem(COOKIE_PREFERENCES_KEY);
    setHasConsent(null);
    setShowBanner(true);
  };

  return {
    hasConsent,
    preferences,
    showBanner,
    acceptAll,
    rejectAll,
    savePreferences,
    resetConsent,
  };
}
