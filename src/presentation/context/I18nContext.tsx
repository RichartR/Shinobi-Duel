import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { SupportedLanguage, LanguageOption, SUPPORTED_LANGUAGES, TranslationDictionary } from '../../infrastructure/i18n/types';
import { i18nService } from '../../infrastructure/i18n/i18nService';

interface I18nContextValue {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  languages: LanguageOption[];
  t: (path: string, params?: Record<string, string | number>) => string;
  dict: TranslationDictionary;
}

const I18nContext = createContext<I18nContextValue | null>(null);

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLangState] = useState<SupportedLanguage>(() => i18nService.detectLanguage());

  const setLanguage = useCallback((lang: SupportedLanguage) => {
    i18nService.setLanguage(lang);
    setLangState(lang);
  }, []);

  const t = useCallback(
    (path: string, params?: Record<string, string | number>) => {
      return i18nService.t(path, params, language);
    },
    [language]
  );

  const dict = useMemo(() => i18nService.getDictionary(language), [language]);

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      languages: SUPPORTED_LANGUAGES,
      t,
      dict,
    }),
    [language, setLanguage, t, dict]
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
};

export function useTranslation() {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    throw new Error('useTranslation must be used within an I18nProvider');
  }
  return ctx;
}
