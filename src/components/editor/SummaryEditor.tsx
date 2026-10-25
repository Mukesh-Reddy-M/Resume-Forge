import React from 'react';

interface SummaryEditorProps {
  summary: string;
  onChange: (summary: string) => void;
}

export const SummaryEditor: React.FC<SummaryEditorProps> = ({ summary, onChange }) => {
  const words = summary ? summary.trim().split(/\s+/).filter(Boolean).length : 0;
  const chars = summary ? summary.length : 0;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-[11px] text-slate-500">
        <span>Write a 2-4 sentence executive summary highlighting key strengths</span>
        <span className="font-mono">
          {words} words · {chars} chars
        </span>
      </div>
      <textarea
        value={summary || ''}
        onChange={(e) => onChange(e.target.value)}
        rows={4}
        placeholder="e.g. Full-Stack AI Developer with experience building high-performance backends..."
        className="w-full text-xs p-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 leading-relaxed text-slate-800"
      />
    </div>
  );
};
