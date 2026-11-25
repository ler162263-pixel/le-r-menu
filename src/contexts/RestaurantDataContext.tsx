import React, { createContext, useEffect, useMemo } from 'react';
import rawMenuDataset from '../data/menu.json';
import type { MenuCategory, MenuItem, RestaurantProfile } from '../types';
import { parseMenuDataset } from '../utils/jsonMenuLoader';

export interface RestaurantDataContextValue {
  isLoading: boolean;
  hasDataError: boolean;
  profile: RestaurantProfile;
  categories: MenuCategory[];
  menuItems: MenuItem[];
}

export const RestaurantDataContext =
  createContext<RestaurantDataContextValue | null>(null);

export function RestaurantDataProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const baseUrl =
    typeof import.meta !== 'undefined' && import.meta.env?.BASE_URL
      ? import.meta.env.BASE_URL
      : './';

  const parsed = useMemo(
    () => parseMenuDataset(rawMenuDataset, baseUrl),
    [baseUrl]
  );

  // Optional template color overrides defined directly inside menu.json
  useEffect(() => {
    const t = parsed.profile.theme;
    if (!t || typeof document === 'undefined') return;
    const rootStyle = document.documentElement.style;
    if (t.brandColor) rootStyle.setProperty('--deep-maroon', t.brandColor);
    if (t.accentRed) rootStyle.setProperty('--brand-red', t.accentRed);
    if (t.parchmentBase) rootStyle.setProperty('--parchment-base', t.parchmentBase);
    if (t.parchmentLight) rootStyle.setProperty('--parchment-light', t.parchmentLight);
    if (t.darkFeature) rootStyle.setProperty('--dark-feature-brown', t.darkFeature);
  }, [parsed.profile.theme]);

  const value = useMemo(
    () => ({
      isLoading: false,
      hasDataError: parsed.hasError,
      profile: parsed.profile,
      categories: parsed.categories,
      menuItems: parsed.menuItems,
    }),
    [parsed]
  );

  return (
    <RestaurantDataContext.Provider value={value}>
      {children}
    </RestaurantDataContext.Provider>
  );
}
