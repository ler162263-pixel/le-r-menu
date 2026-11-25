import React from 'react';

export function MenuSkeletonGrid() {
  return (
    <div
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      aria-hidden="true"
    >
      {[1, 2, 3].map((item) => (
        <div
          key={item}
          className="border border-[var(--border-hairline)] bg-[var(--bg-elevated)] p-4 rounded-sm"
        >
          <div className="aspect-[4/3] w-full bg-[var(--bg-subtle)] animate-pulse mb-4" />
          <div className="h-5 w-2/3 bg-[var(--bg-subtle)] animate-pulse mb-2" />
          <div className="h-4 w-full bg-[var(--bg-subtle)] animate-pulse mb-1" />
          <div className="h-4 w-3/4 bg-[var(--bg-subtle)] animate-pulse" />
        </div>
      ))}
    </div>
  );
}
