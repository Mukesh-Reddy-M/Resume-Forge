import React, { useState, useRef, useEffect, useLayoutEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { ZoomIn, ZoomOut, Maximize2, RotateCcw, FileText } from 'lucide-react';
import { Resume, StyleConfig } from '../../types/resume';
import { getTemplateComponent } from '../../templates';
import { computePages, PageSlice, PAGE_W_PX, PAGE_H_PX, MM_TO_PX } from '../../lib/paginate';

interface LivePreviewProps {
  resume: Resume;
  style: StyleConfig;
}

const PAGE_GAP = 24;

function getPrintRoot(): HTMLElement {
  let el = document.getElementById('print-root');
  if (!el) {
    el = document.createElement('div');
    el.id = 'print-root';
    document.body.appendChild(el);
  }
  return el;
}

export const LivePreview: React.FC<LivePreviewProps> = ({ resume, style }) => {
  const [zoom, setZoom] = useState<number>(0.9);
  const [pages, setPages] = useState<PageSlice[]>([{ start: 0, end: 1 }]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLDivElement>(null);
  const lastPagesKey = useRef('');

  const TemplateComponent = getTemplateComponent(style.template.id);

  const paddingMm = style.density.pagePaddingMm || 15;
  const padPx = Math.round(paddingMm * MM_TO_PX * 100) / 100;
  const contentW = PAGE_W_PX - 2 * padPx;
  // Body height available on each page. 1px of safety so the printed result
  // never breaks *earlier* than the preview promises.
  const bodyH = Math.floor(PAGE_H_PX - 1 - 2 * padPx);

  const measure = useCallback(() => {
    const el = measureRef.current;
    if (!el) return;
    const next = computePages(el, bodyH);
    const key = next.map((p) => `${Math.round(p.start)}-${Math.round(p.end)}`).join('|');
    if (key !== lastPagesKey.current) {
      lastPagesKey.current = key;
      setPages(next);
    }
  }, [bodyH]);

  // Re-measure after every render (cheap; guarded by the key above)…
  useLayoutEffect(() => {
    measure();
  });

  // …and whenever late things change layout: element resize, web fonts, images.
  useEffect(() => {
    const el = measureRef.current;
    if (!el) return;
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    const onFonts = () => measure();
    document.fonts?.addEventListener?.('loadingdone', onFonts);
    document.fonts?.ready?.then(onFonts).catch(() => {});
    el.addEventListener('load', onFonts, true); // <img> load events (capture)
    return () => {
      ro.disconnect();
      document.fonts?.removeEventListener?.('loadingdone', onFonts);
      el.removeEventListener('load', onFonts, true);
    };
  }, [measure]);

  /* ---------------- zoom ---------------- */
  const fitZoom = useCallback((max: number) => {
    const el = scrollRef.current;
    if (!el) return 0.9;
    const gutter = el.clientWidth < 640 ? 24 : 64;
    const z = (el.clientWidth - gutter) / PAGE_W_PX;
    return Math.round(Math.min(max, Math.max(0.3, z)) * 100) / 100;
  }, []);

  useEffect(() => {
    // Fit once when the preview becomes visible / sized.
    const el = scrollRef.current;
    if (!el) return;
    let done = false;
    const ro = new ResizeObserver(() => {
      if (done || el.clientWidth === 0) return;
      done = true;
      setZoom(fitZoom(1.1));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [fitZoom]);

  const handleZoomIn = () => setZoom((z) => Math.min(1.5, Math.round((z + 0.1) * 10) / 10));
  const handleZoomOut = () => setZoom((z) => Math.max(0.3, Math.round((z - 0.1) * 10) / 10));
  const handleResetZoom = () => setZoom(1);
  const handleFitWidth = () => setZoom(fitZoom(1.4));

  const totalPages = pages.length;
  const stackH = totalPages * PAGE_H_PX + (totalPages - 1) * PAGE_GAP;

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-200/80 overflow-hidden relative">
      {/* Toolbar */}
      <div className="no-print h-12 bg-white/90 backdrop-blur-xs border-b border-slate-300/70 px-3 sm:px-4 flex items-center justify-between gap-2 text-xs text-slate-700 shrink-0 z-20 shadow-xs">
        <div className="flex items-center gap-2 min-w-0">
          <FileText className="w-4 h-4 text-slate-500 shrink-0" />
          <span className="hidden sm:inline font-semibold text-slate-800 whitespace-nowrap">A4 Document</span>
          <span className="hidden sm:inline text-slate-400">·</span>
          <span className="px-2 py-0.5 rounded-md bg-slate-100 font-medium text-slate-700 whitespace-nowrap">
            {totalPages === 1 ? '1 Page' : `${totalPages} Pages`}
          </span>
        </div>

        <div className="flex items-center gap-1 sm:gap-1.5 bg-slate-100/90 p-1 rounded-lg shrink-0">
          <button
            type="button"
            onClick={handleZoomOut}
            title="Zoom out"
            aria-label="Zoom out"
            className="p-1 hover:bg-white hover:text-slate-900 rounded transition-colors text-slate-600"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <span className="w-10 sm:w-12 text-center font-medium font-mono text-[11px] text-slate-700">
            {Math.round(zoom * 100)}%
          </span>
          <button
            type="button"
            onClick={handleZoomIn}
            title="Zoom in"
            aria-label="Zoom in"
            className="p-1 hover:bg-white hover:text-slate-900 rounded transition-colors text-slate-600"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <div className="w-[1px] h-3.5 bg-slate-300 mx-0.5" />
          <button
            type="button"
            onClick={handleFitWidth}
            title="Fit to panel width"
            className="px-1.5 sm:px-2 py-1 hover:bg-white hover:text-slate-900 rounded transition-colors text-[11px] font-medium text-slate-600 flex items-center gap-1"
          >
            <Maximize2 className="w-3 h-3" />
            <span className="hidden sm:inline">Fit</span>
          </button>
          <button
            type="button"
            onClick={handleResetZoom}
            title="Reset zoom to 100%"
            aria-label="Reset zoom"
            className="p-1 hover:bg-white hover:text-slate-900 rounded transition-colors text-slate-600"
          >
            <RotateCcw className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Scrollport: pages are real, separately clipped A4 sheets */}
      <div ref={scrollRef} className="flex-1 overflow-auto p-3 sm:p-8">
        <div
          className="mx-auto"
          style={{ width: PAGE_W_PX * zoom, height: stackH * zoom }}
        >
          <div
            className="flex flex-col origin-top-left"
            style={{
              width: PAGE_W_PX,
              gap: PAGE_GAP,
              transform: `scale(${zoom})`,
            }}
          >
            {pages.map((pg, i) => (
              <div
                key={i}
                className="relative bg-white text-slate-900 shadow-xl border border-slate-300/80 overflow-hidden shrink-0"
                style={{ width: PAGE_W_PX, height: PAGE_H_PX }}
              >
                {/*
                  Clip window. Page 1 reaches the sheet's top/side edges so full-bleed
                  headers show; later pages keep the normal top margin.
                */}
                <div
                  className="absolute overflow-hidden"
                  style={{
                    left: 0,
                    width: PAGE_W_PX,
                    top: i === 0 ? 0 : padPx,
                    height: Math.max(1, pg.end - pg.start) + (i === 0 ? padPx : 0),
                  }}
                >
                  <div
                    className="absolute"
                    style={{
                      left: padPx,
                      top: (i === 0 ? padPx : 0) - pg.start,
                      width: contentW,
                    }}
                  >
                    <TemplateComponent data={resume} style={style} />
                  </div>
                </div>
                <div className="absolute inset-x-0 bottom-2 text-center text-[10px] font-mono text-slate-400 pointer-events-none">
                  Page {i + 1} of {totalPages}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/*
        Single-flow copy of the resume. On screen it is off-canvas and only used
        for measuring. When printing it is the *only* thing shown, so the PDF
        contains each line of text exactly once. The thead/tfoot spacers repeat
        on every printed page and give every page the same top/bottom margin
        while @page margin stays 0 (which also suppresses browser header/footer).
      */}
      {createPortal(
        <div aria-hidden="true">
          <table className="print-table" style={{ width: PAGE_W_PX }}>
            <thead>
              <tr>
                <td style={{ height: `${paddingMm}mm`, padding: 0 }} />
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ padding: `0 ${paddingMm}mm` }}>
                  <div ref={measureRef} className="print-flow" style={{ width: contentW, display: 'flow-root' }}>
                    <TemplateComponent data={resume} style={style} />
                  </div>
                </td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td style={{ height: `${paddingMm}mm`, padding: 0 }} />
              </tr>
            </tfoot>
          </table>
        </div>,
        getPrintRoot()
      )}
    </div>
  );
};
