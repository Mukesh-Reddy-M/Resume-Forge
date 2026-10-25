import React, { useState } from 'react';
import { X, Upload, AlertCircle, CheckCircle2, FileCode } from 'lucide-react';
import { Resume } from '../../types/resume';
import { validateResumeJSON } from '../../lib/storage';
import { Modal, useTitleId } from './Modal';

interface ImportJsonModalProps {
  onClose: () => void;
  onImport: (resume: Resume) => void;
}

/** Mount only while open — state resets on every open. */
export const ImportJsonModal: React.FC<ImportJsonModalProps> = ({
  onClose,
  onImport,
}) => {
  const [jsonText, setJsonText] = useState('');
  const [errors, setErrors] = useState<string[]>([]);
  const [parsedData, setParsedData] = useState<Resume | null>(null);

  const titleId = useTitleId('import-modal-title');

  const handleTextChange = (text: string) => {
    setJsonText(text);
    if (!text.trim()) {
      setErrors([]);
      setParsedData(null);
      return;
    }

    try {
      const parsed = JSON.parse(text);
      const res = validateResumeJSON(parsed);
      if (res.valid && res.resume) {
        setErrors([]);
        setParsedData(res.resume);
      } else {
        setErrors(res.errors);
        setParsedData(null);
      }
    } catch (e: any) {
      setErrors([`JSON Syntax Error: ${e.message}`]);
      setParsedData(null);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      handleTextChange(content);
    };
    reader.readAsText(file);
  };

  const handleConfirmImport = () => {
    if (parsedData) {
      onImport(parsedData);
      onClose();
    }
  };

  return (
    <Modal onClose={onClose} titleId={titleId} maxWidthClass="max-w-xl">
      <div className="flex flex-col min-h-0">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700">
              <FileCode className="w-4 h-4" />
            </div>
            <div>
              <h3 id={titleId} className="text-base font-bold text-slate-900">Import Resume JSON</h3>
              <p className="text-xs text-slate-500">Upload or paste resume data formatted to schema</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4 overflow-y-auto min-h-0">
          {/* File Upload zone */}
          <label className="border-2 border-dashed border-slate-200 hover:border-slate-300 bg-slate-50 hover:bg-slate-100/60 rounded-xl p-4 flex items-center justify-center gap-3 cursor-pointer transition-colors text-center">
            <Upload className="w-5 h-5 text-slate-500 shrink-0" />
            <div>
              <span className="text-xs font-semibold text-slate-700">Click to upload .json file</span>
              <span className="text-[11px] text-slate-400 block">or paste content directly below</span>
            </div>
            <input type="file" accept=".json,application/json" onChange={handleFileUpload} className="hidden" />
          </label>

          {/* Text Area */}
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1.5">
              Resume JSON Payload
            </label>
            <textarea
              value={jsonText}
              onChange={(e) => handleTextChange(e.target.value)}
              placeholder="Paste JSON here..."
              rows={8}
              className="w-full font-mono text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 bg-slate-900 text-slate-100 resize-y"
            />
          </div>

          {/* Error display */}
          {errors.length > 0 && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl space-y-1">
              <div className="flex items-center gap-2 text-rose-800 text-xs font-bold">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>Validation Issues ({errors.length})</span>
              </div>
              <ul className="list-disc list-outside ml-5 text-[11px] text-rose-700 space-y-0.5">
                {errors.map((err, idx) => (
                  <li key={idx}>{err}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Valid preview banner */}
          {parsedData && (
            <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-2.5 text-emerald-900 text-xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Valid Resume Data Detected</p>
                <p className="text-[11px] text-emerald-700 mt-0.5">
                  Candidate: <strong>{parsedData.basics.name}</strong> • Template:{' '}
                  {parsedData.meta.templateId} • Experience: {parsedData.experience?.length || 0} entries
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={!parsedData}
            onClick={handleConfirmImport}
            className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 disabled:opacity-50 disabled:pointer-events-none rounded-lg shadow-xs transition-colors"
          >
            Import Resume
          </button>
        </div>
      </div>
    </Modal>
  );
};
