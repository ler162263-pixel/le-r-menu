export type Language = 'fr' | 'en' | 'ar';
export type ThemeMode = 'light' | 'dark';

export interface LocalizedText {
  fr: string;
  en: string;
  ar: string;
}

export interface ToastNotice {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}
