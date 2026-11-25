import React, {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { TRANSLATIONS, type TranslationDictionary } from '../i18n/translations';
import type { Language } from '../types';

export interface LanguageContextValue {
  lang: Language;
  dir: 'ltr' | 'rtl';
  t: TranslationDictionary;
  setLanguage: (lang: Language) => void;
}

const LANG_STORAGE_KEY = 'le_r_lang';

export const LanguageContext = createContext<LanguageContextValue | null>(null);

function getInitialLang(): Language {
  if (typeof window === 'undefined') return 'fr';
  try {
    const stored = window.localStorage.getItem(LANG_STORAGE_KEY);
    return stored === 'fr' || stored === 'en' || stored === 'ar' ? stored : 'fr';
  } catch {
    return 'fr';
  }
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Language>(getInitialLang);

  const dir: 'ltr' | 'rtl' = lang === 'ar' ? 'rtl' : 'ltr';
  const t = TRANSLATIONS[lang];

  useEffect(() => {
    const root = document.documentElement;
    root.lang = lang;
    root.dir = dir;
    try {
      window.localStorage.setItem(LANG_STORAGE_KEY, lang);
    } catch {
      // Ignore storage write failures in privacy-restricted environments
    }
  }, [lang, dir]);

  const setLanguage = useCallback((next: Language) => {
    setLangState(next);
  }, []);

  const value = useMemo(
    () => ({ lang, dir, t, setLanguage }),
    [lang, dir, t, setLanguage]
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}
