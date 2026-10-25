export const PAGE_W_PX = 794; // A4 width @96dpi
export const PAGE_H_PX = 1123; // A4 height @96dpi (1122.52 rounded up)
export const MM_TO_PX = 96 / 25.4;

export interface PageSlice {
  /** y offset (inside the content box) where this page starts */
  start: number;
  /** y offset where it ends */
  end: number;
}

interface Atom {
  top: number;
  bottom: number;
  heading: boolean;
}

/** Elements that must not be split across pages. Mirrors the print CSS. */
const ATOM_SELECTOR = '.break-inside-avoid, li, h2, [data-heading]';

/**
 * Splits laid-out content into pages by *measuring* it. Cuts are only made at
 * safe boundaries: an entry (or bullet) that would straddle the page edge is
 * moved whole to the next page, and a section heading is never left alone at
 * the bottom of a page. This matches the CSS fragmentation rules applied when
 * the same markup is printed.
 */
export function computePages(root: HTMLElement, pageH: number): PageSlice[] {
  const rootRect = root.getBoundingClientRect();
  const total = Math.max(1, Math.ceil(rootRect.height));

  const atoms: Atom[] = Array.from(root.querySelectorAll<HTMLElement>(ATOM_SELECTOR))
    .map((el) => {
      const r = el.getBoundingClientRect();
      return {
        top: r.top - rootRect.top,
        bottom: r.bottom - rootRect.top,
        heading: el.tagName === 'H2' || el.hasAttribute('data-heading'),
      };
    })
    .filter((a) => a.bottom - a.top > 0.5);

  const cuts: number[] = [0];
  let start = 0;
  let guard = 0;

  while (total - start > pageH + 0.5 && guard++ < 200) {
    const limit = start + pageH;
    let cut = limit;

    // 1. Outermost unbreakable block straddling the page edge moves down.
    let straddlerTop = Infinity;
    for (const a of atoms) {
      if (a.top > start + 1 && a.top < limit - 0.5 && a.bottom > limit + 0.5) {
        straddlerTop = Math.min(straddlerTop, a.top);
      }
    }
    if (straddlerTop !== Infinity) cut = straddlerTop;

    // 2. Don't strand a heading at the bottom of the page.
    for (let i = 0; i < 4; i++) {
      const orphan = atoms.find(
        (h) =>
          h.heading &&
          h.top > start + 1 &&
          h.bottom <= cut + 0.5 &&
          h.bottom > cut - 48 &&
          !atoms.some((n) => !n.heading && n.top >= h.bottom - 2 && n.bottom <= cut + 0.5)
      );
      if (!orphan) break;
      cut = orphan.top;
    }

    // Safety: never produce a (near) empty page.
    if (cut <= start + 24) cut = limit;

    cuts.push(cut);
    start = cut;
  }

  return cuts.map((s, i) => ({ start: s, end: i + 1 < cuts.length ? cuts[i + 1] : total }));
}
