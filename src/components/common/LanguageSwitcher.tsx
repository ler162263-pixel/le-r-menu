import React from 'react';
import { Globe } from 'lucide-react';
import type { Language } from '../../types';

interface LanguageSwitcherProps {
  lang: Language;
  onChange: (lang: Language) => void;
  label: string;
}

const LANGUAGE_OPTIONS: { code: Language; short: string; native: string }[] = [
  { code: 'fr', short: 'FR', native: 'Français' },
  { code: 'en', short: 'EN', native: 'English' },
  { code: 'ar', short: 'AR', native: 'العربية' },
];

export function LanguageSwitcher({
  lang,
  onChange,
  label,
}: LanguageSwitcherProps) {
  return (
    <div
      className="inline-flex items-center border border-[var(--border-hairline)] bg-[var(--bg-elevated)] p-0.5 rounded-sm"
      role="group"
      aria-label={label}
    >
      <span
        className="px-2 text-[var(--text-muted)] hidden sm:inline-flex"
        aria-hidden="true"
      >
        <Globe className="w-3.5 h-3.5" />
      </span>
      {LANGUAGE_OPTIONS.map((opt) => {
        const active = lang === opt.code;
        return (
          <button
            key={opt.code}
            type="button"
            onClick={() => onChange(opt.code)}
            aria-pressed={active}
            aria-label={opt.native}
            className={`min-h-[36px] px-2.5 py-1 text-xs font-medium tracking-wide transition-colors whitespace-nowrap shrink-0 rounded-sm focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--accent-burgundy)] ${
              active
                ? 'bg-[var(--accent-burgundy)] text-[#FAF7F2]'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            {opt.short}
          </button>
        );
      })}
    </div>
  );
}
