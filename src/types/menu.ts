import type { LocalizedText } from './common';

export interface MenuSupplement {
  id: string;
  label: LocalizedText;
  price: number;
}

export interface MenuSubSectionItem {
  id: string;
  label: LocalizedText;
  price: number;
}

export interface MenuSubSection {
  id: string;
  title: LocalizedText;
  themeVariant: 'dark-feature';
  engravingKey?: string;
  items: MenuSubSectionItem[];
  supplements?: MenuSupplement[];
}

export interface MenuCategory {
  id: string;
  name: LocalizedText;
  description: LocalizedText;
  subtitle?: LocalizedText;
  sortOrder: number;
  active: boolean;
  themeVariant?: 'default' | 'dark-feature';
  engravingKey?: string;
  supplements?: MenuSupplement[];
  subSections?: MenuSubSection[];
}

export interface MenuItem {
  id: string;
  categoryId: string;
  name: LocalizedText;
  description: LocalizedText;
  price: number;
  image: string;
  available: boolean;
  visible: boolean;
  dietaryNote?: LocalizedText;
}
