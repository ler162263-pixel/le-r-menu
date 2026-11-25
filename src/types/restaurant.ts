import type { LocalizedText } from './common';

export interface SocialLinks {
  tiktok: string;
  snapchat: string;
  instagram?: string;
  facebook?: string;
}

export interface RestaurantThemeConfig {
  brandColor?: string;
  accentRed?: string;
  parchmentBase?: string;
  parchmentLight?: string;
  darkFeature?: string;
}

export interface RestaurantProfile {
  logoLabel: string;
  brandName: LocalizedText;
  brandSubtitle: LocalizedText;
  heroIntro: LocalizedText;
  storyTitle: LocalizedText;
  storyBody: LocalizedText;
  atmosphereNote: LocalizedText;
  address: LocalizedText;
  hours: LocalizedText;
  phone: string;
  email: string;
  heroImage: string;
  interiorImage: string;
  social: SocialLinks;
  theme?: RestaurantThemeConfig;
}
