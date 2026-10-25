import React, { useState, useRef, useEffect } from 'react';
import {
  Download,
  Upload,
  RotateCcw,
  Loader2,
  FileDown,
  MoreHorizontal,
} from 'lucide-react';
import { Resume, TemplateDefinition } from '../../types/resume';
import { exportResumeAsJson } from '../../lib/storage';

type MobileTab = 'edit' | 'preview' | 'style';

interface TopBarProps {
  resume: Resume;
  activeTemplate: TemplateDefinition;
  onImportClick: () => void;
  onResetClick: () => void;
  onDownloadPdf: () => void;
  isExporting: boolean;
  onToast?: (message: string) => void;
  activeMobileTab?: MobileTab;
  onMobileTabChange?: (tab: MobileTab) => void;
}

const ghostBtn =
  'flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors whitespace-nowrap cursor-pointer';

export const TopBar: React.FC<TopBarProps> = ({
  resume,
  activeTemplate,
  onImportClick,
  onResetClick,
  onDownloadPdf,
  isExporting,
  onToast,
  activeMobileTab,
  onMobileTabChange,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isMenuOpen) return;
    const onDown = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setIsMenuOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsMenuOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [isMenuOpen]);

  const handleExportJson = () => {
    exportResumeAsJson(resume);
    onToast?.('Exported resume JSON');
  };

  const tabs: Array<{ id: MobileTab; label: string }> = [
    { id: 'edit', label: 'Edit' },
    { id: 'preview', label: 'Preview' },
    { id: 'style', label: 'Style' },
  ];

  return (
    <header className="no-print h-14 bg-white border-b border-slate-200 px-3 sm:px-6 flex items-center justify-between gap-2 sm:gap-4 z-30 sticky top-0 select-none">
      {/* Wordmark & template name */}
      <div className="flex items-center gap-3 shrink-0 min-w-0">
        <a href="/" className="flex items-center gap-2 group" aria-label="ResumeForge home">
          <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-sm shadow-xs group-hover:bg-slate-800 transition-colors">
            RF
          </div>
          <span className="hidden sm:inline text-base font-bold tracking-tight text-slate-900 whitespace-nowrap">
            ResumeForge
          </span>
        </a>

        <div className="hidden md:flex items-center gap-1.5 pl-3 border-l border-slate-200 text-xs text-slate-500">
          <span className="text-slate-400">Template:</span>
          <span className="font-semibold text-slate-700 whitespace-nowrap">{activeTemplate.name}</span>
        </div>
      </div>

      {/* Mobile / tablet tab switcher */}
      {onMobileTabChange && (
        <div
          role="tablist"
          aria-label="Workspace panel"
          className="flex lg:hidden items-center bg-slate-100 p-1 rounded-lg text-xs font-medium min-w-0"
        >
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={activeMobileTab === t.id}
              onClick={() => onMobileTabChange(t.id)}
              className={`px-2.5 sm:px-3 py-1 rounded-md transition-colors ${
                activeMobileTab === t.id
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-1 sm:gap-2 shrink-0">
        {/* Inline actions on desktop */}
        <button type="button" onClick={onResetClick} title="Reset to Mukesh's sample resume" className={`hidden lg:flex ${ghostBtn} text-slate-600`}>
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Sample</span>
        </button>
        <button type="button" onClick={onImportClick} className={`hidden lg:flex ${ghostBtn}`}>
          <Upload className="w-3.5 h-3.5" />
          <span>Import JSON</span>
        </button>
        <button type="button" onClick={handleExportJson} className={`hidden lg:flex ${ghostBtn}`}>
          <Download className="w-3.5 h-3.5" />
          <span>Export JSON</span>
        </button>

        {/* Overflow menu below lg: nothing is unreachable on small screens */}
        <div ref={menuRef} className="relative lg:hidden">
          <button
            type="button"
            onClick={() => setIsMenuOpen((v) => !v)}
            aria-haspopup="menu"
            aria-expanded={isMenuOpen}
            aria-label="More actions"
            className="p-2 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>
          {isMenuOpen && (
            <div
              role="menu"
              className="absolute right-0 top-full mt-1.5 w-48 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50"
            >
              {[
                { label: 'Import JSON', icon: Upload, run: onImportClick },
                { label: 'Export JSON', icon: Download, run: handleExportJson },
                { label: 'Reset Sample', icon: RotateCcw, run: onResetClick },
              ].map(({ label, icon: Icon, run }) => (
                <button
                  key={label}
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    setIsMenuOpen(false);
                    run();
                  }}
                  className="w-full px-3 py-2 text-left text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2.5"
                >
                  <Icon className="w-3.5 h-3.5 text-slate-500" />
                  {label}
                </button>
              ))}
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={onDownloadPdf}
          disabled={isExporting}
          title="Opens the print dialog — choose “Save as PDF” for a text-based, ATS-readable file"
          className="flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 disabled:opacity-50 rounded-lg shadow-xs transition-colors whitespace-nowrap cursor-pointer"
        >
          {isExporting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <FileDown className="w-3.5 h-3.5" />}
          <span className="hidden sm:inline">{isExporting ? 'Preparing…' : 'Download PDF'}</span>
          <span className="sm:hidden">PDF</span>
        </button>
      </div>
    </header>
  );
};
