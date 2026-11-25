import React from 'react';
import { CheckCircle2, X } from 'lucide-react';
import { useToast, useTranslation } from '../../hooks';

export function ToastContainer() {
  const { toasts, dismissToast } = useToast();
  const { t } = useTranslation();

  if (toasts.length === 0) return null;

  return (
    <div
      className="no-print fixed bottom-4 end-4 z-50 flex flex-col gap-2 max-w-sm w-[calc(100%-2rem)]"
      aria-live="polite"
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          role="status"
          className="flex items-start gap-3 p-3.5 bg-[var(--bg-elevated)] border border-[var(--border-strong)] shadow-lg rounded-sm text-sm text-[var(--text-primary)]"
        >
          <CheckCircle2
            className={`w-4 h-4 mt-0.5 shrink-0 ${
              toast.type === 'error'
                ? 'text-red-600 dark:text-red-400'
                : 'text-[var(--accent-burgundy)]'
            }`}
            aria-hidden="true"
          />
          <p dir="auto" className="flex-1 leading-snug">
            {toast.message}
          </p>
          <button
            type="button"
            onClick={() => dismissToast(toast.id)}
            aria-label={t.common.close}
            className="text-[var(--text-muted)] hover:text-[var(--text-primary)] p-0.5 shrink-0"
          >
            <X className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>
      ))}
    </div>
  );
}
