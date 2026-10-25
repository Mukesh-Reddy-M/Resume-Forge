import React, { useState, useEffect, useMemo, useCallback, useRef, lazy, Suspense } from 'react';
import { Resume, StyleConfig, PhotoShape } from './types/resume';
import {
  loadSavedResume,
  saveResumeDebounced,
  saveResumeImmediately,
  flushPendingSave,
  resetResumeToSample,
  subscribeSaveStatus,
  safeBaseName,
} from './lib/storage';
import { getTemplateById, getFontPairById, getDensityPreset } from './lib/data';
import { loadFontPair, preloadAllFonts } from './lib/fontLoader';
import { printResume } from './lib/print';
import { TopBar } from './components/navbar/TopBar';
import { EditorPanel } from './components/editor/EditorPanel';
import { LivePreview } from './components/preview/LivePreview';
import { StylePanel } from './components/style/StylePanel';

// Modals pull in react-easy-crop etc. — load them on demand.
const PhotoCropModal = lazy(() =>
  import('./components/modals/PhotoCropModal').then((m) => ({ default: m.PhotoCropModal }))
);
const ImportJsonModal = lazy(() =>
  import('./components/modals/ImportJsonModal').then((m) => ({ default: m.ImportJsonModal }))
);

export default function App() {
  const [resume, setResume] = useState<Resume>(() => loadSavedResume());
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [mobileTab, setMobileTab] = useState<'edit' | 'preview' | 'style'>('preview');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = useCallback((msg: string, ms = 3500) => {
    setToastMessage(msg);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToastMessage(null), ms);
  }, []);

  useEffect(() => () => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
  }, []);

  // Fonts
  useEffect(() => {
    preloadAllFonts();
  }, []);
  useEffect(() => {
    const fontPair = getFontPairById(resume.meta.fontId);
    if (fontPair && fontPair.google) loadFontPair(fontPair.google);
  }, [resume.meta.fontId]);

  // Surface storage failures instead of swallowing them.
  useEffect(() => subscribeSaveStatus((ok, message) => setSaveError(ok ? null : message ?? 'Could not save.')), []);

  // Never lose the last second of edits: flush the debounce when the page goes away.
  useEffect(() => {
    const flush = () => flushPendingSave();
    const onVisibility = () => {
      if (document.visibilityState === 'hidden') flush();
    };
    window.addEventListener('pagehide', flush);
    window.addEventListener('beforeunload', flush);
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      window.removeEventListener('pagehide', flush);
      window.removeEventListener('beforeunload', flush);
      document.removeEventListener('visibilitychange', onVisibility);
      flush();
    };
  }, []);

  const handleResumeChange = useCallback((updated: Resume) => {
    setResume(updated);
    saveResumeDebounced(updated);
  }, []);

  const handleReset = () => {
    if (window.confirm("Reset all content and styling to Mukesh's default sample resume?")) {
      setResume(resetResumeToSample());
      showToast('Reset to default sample resume');
    }
  };

  const handleImport = (imported: Resume) => {
    setResume(imported);
    saveResumeImmediately(imported);
    showToast(`Successfully imported resume for ${imported.basics.name}`);
  };

  const handlePhotoSave = (photoUrl: string, shape: PhotoShape) => {
    handleResumeChange({
      ...resume,
      meta: { ...resume.meta, photoUrl, photoShape: shape, showPhoto: true },
    });
    showToast('Photo cropped and applied');
  };

  // Single PDF handler (used by the top bar only).
  const handleDownloadPdf = useCallback(async () => {
    setIsExportingPdf(true);
    try {
      showToast('In the print dialog, choose “Save as PDF” as the destination.', 5000);
      await printResume(`${safeBaseName(resume)}_resume`);
    } catch (e) {
      console.error('Print error:', e);
      showToast('Printing is blocked here. Open the app in its own browser tab and try again.', 6000);
    } finally {
      setIsExportingPdf(false);
    }
  }, [resume, showToast]);

  const activeTemplate = useMemo(() => getTemplateById(resume.meta.templateId), [resume.meta.templateId]);

  const styleConfig: StyleConfig = useMemo(
    () => ({
      template: activeTemplate,
      density: getDensityPreset(resume.meta.density),
      fontPair: getFontPairById(resume.meta.fontId),
      accent: resume.meta.accent,
      showPhoto: resume.meta.showPhoto && !!resume.meta.photoUrl && activeTemplate.supportsPhoto,
      photoUrl: resume.meta.photoUrl,
      photoShape: resume.meta.photoShape,
    }),
    [activeTemplate, resume.meta]
  );

  return (
    <div className="h-screen h-dvh flex flex-col bg-slate-100 font-sans overflow-hidden text-slate-900">
      <TopBar
        resume={resume}
        activeTemplate={activeTemplate}
        onImportClick={() => setIsImportModalOpen(true)}
        onResetClick={handleReset}
        onDownloadPdf={handleDownloadPdf}
        isExporting={isExportingPdf}
        onToast={showToast}
        activeMobileTab={mobileTab}
        onMobileTabChange={setMobileTab}
      />

      {saveError && (
        <div
          role="alert"
          className="no-print shrink-0 bg-rose-600 text-white text-xs font-medium px-4 py-2 flex items-center justify-between gap-3"
        >
          <span>{saveError}</span>
          <button
            type="button"
            onClick={() => setSaveError(null)}
            className="shrink-0 underline underline-offset-2 hover:no-underline"
          >
            Dismiss
          </button>
        </div>
      )}

      <main className="flex-1 flex overflow-hidden relative min-h-0">
        <div
          className={`w-full lg:w-[380px] xl:w-[410px] shrink-0 h-full ${
            mobileTab === 'edit' ? 'flex flex-col' : 'hidden lg:flex lg:flex-col'
          }`}
        >
          <EditorPanel resume={resume} onChange={handleResumeChange} />
        </div>

        <div
          className={`flex-1 h-full min-w-0 ${
            mobileTab === 'preview' ? 'flex flex-col' : 'hidden lg:flex lg:flex-col'
          }`}
        >
          <LivePreview resume={resume} style={styleConfig} />
        </div>

        <div
          className={`w-full lg:w-[330px] xl:w-[360px] shrink-0 h-full ${
            mobileTab === 'style' ? 'flex flex-col' : 'hidden lg:flex lg:flex-col'
          }`}
        >
          <StylePanel
            resume={resume}
            onChange={handleResumeChange}
            onOpenPhotoCrop={() => setIsPhotoModalOpen(true)}
          />
        </div>
      </main>

      <Suspense fallback={null}>
        {isPhotoModalOpen && (
          <PhotoCropModal
            onClose={() => setIsPhotoModalOpen(false)}
            currentPhotoUrl={resume.meta.photoUrl}
            currentShape={resume.meta.photoShape}
            onSave={handlePhotoSave}
          />
        )}
        {isImportModalOpen && (
          <ImportJsonModal onClose={() => setIsImportModalOpen(false)} onImport={handleImport} />
        )}
      </Suspense>

      {toastMessage && (
        <div
          role="status"
          className="no-print fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] max-w-[92vw] text-center bg-slate-900 text-white text-xs font-medium px-4 py-2.5 rounded-xl shadow-lg border border-slate-700"
        >
          {toastMessage}
        </div>
      )}
    </div>
  );
}
