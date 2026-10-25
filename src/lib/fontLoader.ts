import { FONT_PAIRS } from './data';

const loadedFontUrls = new Set<string>();

/**
 * Injects a Google Fonts stylesheet for the given font pair if not already loaded.
 */
export function loadFontPair(googleQuery: string): void {
  if (!googleQuery) return;
  const url = `https://fonts.googleapis.com/css2?family=${googleQuery}&display=swap`;
  if (loadedFontUrls.has(url)) return;

  const existing = document.querySelector(`link[data-font-url="${url}"]`);
  if (!existing) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = url;
    link.dataset.fontUrl = url;
    document.head.appendChild(link);
    loadedFontUrls.add(url);
  }
}

/**
 * Preloads all defined font pairs so preview cards and template switches render instantaneously.
 */
export function preloadAllFonts(): void {
  FONT_PAIRS.forEach(fp => {
    if (fp.google) {
      loadFontPair(fp.google);
    }
  });
}
