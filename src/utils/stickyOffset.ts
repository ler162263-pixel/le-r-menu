export interface StickyHeaderMetrics {
  position: string;
  top: number;
  bottom: number;
  height: number;
}

/**
 * Computes the sticky `top` offset (in px) for the MenuPage search & category bar.
 *
 * - If the site header is pinned (`sticky` or `fixed`) and currently visible at the top,
 *   positions the search/category bar flush beneath its rendered bottom edge so zero gap
 *   or bleed-through occurs.
 * - If the header is non-sticky (`relative`/`static`), returns 0 once it scrolls out of view
 *   so the sticky bar occupies the very top of the viewport instead of leaving an empty gap.
 */
export function computeStickyBarTop(metrics: StickyHeaderMetrics | null): number {
  if (!metrics) return 0;
  const isPinned = metrics.position === 'sticky' || metrics.position === 'fixed';
  if (isPinned) {
    return Math.max(0, Math.round(metrics.height * 10) / 10);
  }
  // When header is not sticky, the search bar sits far below the page fold;
  // by the time the search bar sticks, the header has scrolled above top: 0.
  return 0;
}

/**
 * Computes `scroll-margin-top` and scroll-spy top threshold (in px) based on
 * the sticky top offset plus the actual measured height of the sticky search/category bar.
 */
export function computeStickyScrollClearance(
  stickyTop: number,
  stickyBarHeight: number,
  breathingRoom = 12
): number {
  const safeTop = Math.max(0, stickyTop);
  const safeBarHeight = Math.max(0, stickyBarHeight);
  return Math.round(safeTop + safeBarHeight + Math.max(0, breathingRoom));
}

/**
 * Computes the horizontal scroll delta needed inside the category rail `<nav>`
 * so the active category button centers horizontally without ever triggering vertical
 * window scrolling. Works identically in LTR and RTL layouts.
 */
export function computeHorizontalRailDelta(
  navLeft: number,
  navWidth: number,
  btnLeft: number,
  btnWidth: number
): number {
  if (navWidth <= 0 || btnWidth <= 0) return 0;
  const navCenter = navLeft + navWidth / 2;
  const btnCenter = btnLeft + btnWidth / 2;
  return Math.round(btnCenter - navCenter);
}
