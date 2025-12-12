import React, { createContext, useContext, ReactNode, useState, useEffect } from "react";
import useLanguage from "../hooks/useLanguage";
import type { Language } from "../hooks/useLanguage";

interface Translations {
  [key: string]: any;
}

interface LanguageOption {
  code: Language;
  name: string;
  flag: string;
}

interface LanguageContextType {
  language: Language;
  languages: LanguageOption[];
  currentLanguage: LanguageOption;
  changeLanguage: (lang: Language) => void;
  t: (key: string) => string;
  translations: Translations;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
  children: ReactNode;
}

function LanguageProvider({ children }: LanguageProviderProps) {
  const { language, languages, currentLanguage, changeLanguage } = useLanguage();
  const [translations, setTranslations] = useState<Translations>({});
  const [isLoading, setIsLoading] = useState(true);

  // Load translations
  useEffect(() => {
    async function loadTranslations() {
      setIsLoading(true);
      try {
        const module = await import(`../locales/${language}/common.json`);
        setTranslations(module.default);
      } catch (error) {
        console.error(`Failed to load translations for ${language}:`, error);
        // Fallback to Vietnamese
        try {
          const fallback = await import("../locales/vi/common.json");
          setTranslations(fallback.default);
        } catch (fallbackError) {
          console.error("Failed to load fallback translations:", fallbackError);
          setTranslations({});
        }
      } finally {
        setIsLoading(false);
      }
    }
    loadTranslations();
  }, [language]);

  // Translation function
  const t = (key: string): string => {
    const keys = key.split(".");
    let value: any = translations;

    for (const k of keys) {
      if (value && typeof value === "object" && k in value) {
        value = value[k];
      } else {
        return key; // Return key if translation not found
      }
    }

    return typeof value === "string" ? value : key;
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        languages,
        currentLanguage,
        changeLanguage,
        t,
        translations,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

function useTranslation() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useTranslation must be used within a LanguageProvider");
  }
  return context;
}

export { LanguageProvider, useTranslation };

