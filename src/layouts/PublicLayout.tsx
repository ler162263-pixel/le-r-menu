import React from 'react';
import { Outlet } from 'react-router-dom';
import { EditorialScrollProgress } from '../components/common';
import { PublicFooter, PublicHeader } from '../components/public';
import { useTheme, useTranslation } from '../hooks';

export function PublicLayout() {
  const { theme } = useTheme();
  const { t } = useTranslation();

  return (
    <div
      className={`min-h-screen flex flex-col text-[var(--text-primary)] ${
        theme === 'light' ? 'parchment-canvas' : 'bg-[var(--bg-canvas)]'
      }`}
    >
      <EditorialScrollProgress />
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:start-3 focus:z-50 focus:px-4 focus:py-2 focus:bg-[#8E0F14] focus:text-[#FBF1DA] focus:text-xs focus:font-semibold focus:rounded-sm"
      >
        {t.nav.skipToContent}
      </a>
      <PublicHeader />
      <main id="main-content" className="flex-1">
        <Outlet />
      </main>
      <PublicFooter />
    </div>
  );
}
