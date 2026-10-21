import { SupportedLanguage, TranslationDictionary } from './types';
import { esLocale } from './locales/es';
import { enLocale } from './locales/en';
import { jaLocale } from './locales/ja';

const LOCALES: Record<SupportedLanguage, TranslationDictionary> = {
  es: esLocale,
  en: enLocale,
  ja: jaLocale,
};

const STORAGE_KEY = 'shinobi_duel_language';

export class I18nService {
  private currentLanguage: SupportedLanguage = 'es';

  constructor() {
    this.currentLanguage = this.detectLanguage();
  }

  public detectLanguage(): SupportedLanguage {
    if (typeof window === 'undefined') return 'es';
    try {
      const stored = localStorage.getItem(STORAGE_KEY) as SupportedLanguage;
      if (stored && (stored === 'es' || stored === 'en' || stored === 'ja')) {
        return stored;
      }
      const navLang = (navigator.language || '').toLowerCase();
      if (navLang.startsWith('en')) return 'en';
      if (navLang.startsWith('ja')) return 'ja';
      return 'es';
    } catch {
      return 'es';
    }
  }

  public setLanguage(lang: SupportedLanguage): void {
    this.currentLanguage = lang;
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, lang);
      } catch {
        // Ignore storage exceptions
      }
    }
  }

  public getLanguage(): SupportedLanguage {
    return this.currentLanguage;
  }

  public getDictionary(lang?: SupportedLanguage): TranslationDictionary {
    return LOCALES[lang || this.currentLanguage] || LOCALES.es;
  }

  /**
   * Type-safe key resolver with path notation (e.g. 'common.backToMenu' or 'board.entryP1')
   */
  public t(path: string, params?: Record<string, string | number>, lang?: SupportedLanguage): string {
    const dict = this.getDictionary(lang);
    const parts = path.split('.');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let current: any = dict;

    for (const part of parts) {
      if (current && typeof current === 'object' && part in current) {
        current = current[part];
      } else {
        return path; // Fallback to path string if not found
      }
    }

    if (typeof current !== 'string') return path;

    let result = current;
    if (params) {
      for (const [key, value] of Object.entries(params)) {
        result = result.replace(new RegExp(`{${key}}`, 'g'), String(value));
      }
    }
    return result;
  }
}

export const i18nService = new I18nService();
