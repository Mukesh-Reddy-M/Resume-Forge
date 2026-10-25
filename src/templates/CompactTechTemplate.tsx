import React from 'react';
import { TemplateProps } from './types';

export const CompactTechTemplate: React.FC<TemplateProps> = ({ data, style }) => {
  const { meta, basics, summary, education, skills, experience, projects, custom } = data;
  const hidden = new Set(meta.hiddenSections || []);
  const accent = style.accent || '#0b6e4f';

  const renderHeading = (title: string) => (
    <div className="flex items-center gap-2 mt-2.5 first:mt-0 mb-1 border-b border-slate-300 pb-0.5">
      <span className="font-mono text-[11px] font-bold" style={{ color: accent }}>
        [{' '}
      </span>
      <h2
        className="font-mono text-xs font-bold tracking-tight uppercase"
        style={{ color: accent }}
      >
        {title}
      </h2>
      <span className="font-mono text-[11px] font-bold" style={{ color: accent }}>
        {' '}
        ]
      </span>
    </div>
  );

  return (
    <div
      className="text-slate-900 bg-white w-full"
      style={{
        fontFamily: style.fontPair.body,
        fontSize: `${style.template.tokens.bodySize || 9.5}pt`,
        lineHeight: style.density.lineHeight,
      }}
    >
      {/* Top Header */}
      <header className="mb-2 pb-1.5 border-b border-slate-300">
        <div className="flex justify-between items-baseline">
          <h1
            className="text-xl font-bold tracking-tight font-mono"
            style={{ color: accent }}
          >
            {basics.name}
          </h1>
          {basics.title && (
            <span className="font-mono text-xs text-slate-600">&lt;{basics.title}&gt;</span>
          )}
        </div>

        <div className="font-mono text-[9pt] text-slate-600 flex flex-wrap items-center gap-x-2 mt-0.5">
          {basics.email && (
            <a href={`mailto:${basics.email}`} className="hover:underline">
              {basics.email}
            </a>
          )}
          {basics.phone && <span>· {basics.phone}</span>}
          {basics.location && <span>· {basics.location}</span>}
          {basics.links?.map((link, idx) => (
            <span key={idx}>
              ·{' '}
              {link.url ? (
                <a
                  href={link.url.startsWith('http') ? link.url : `https://${link.url}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline text-slate-800 font-medium"
                >
                  {link.label}
                </a>
              ) : (
                link.label
              )}
            </span>
          ))}
        </div>
      </header>

      {/* Body sections */}
      <div className="space-y-2">
        {!hidden.has('summary') && summary && (
          <section className="break-inside-avoid">
            {renderHeading('SUMMARY')}
            <p className="text-slate-700 leading-snug">{summary}</p>
          </section>
        )}

        {!hidden.has('skills') && skills && skills.length > 0 && (
          <section className="break-inside-avoid">
            {renderHeading('TECHNICAL_STACK')}
            <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-[9pt]">
              {skills.map((skillGroup, idx) => (
                <div key={skillGroup.id || idx} className="leading-tight">
                  <span className="font-mono font-bold text-slate-800">
                    {skillGroup.category}:{' '}
                  </span>
                  <span className="text-slate-700 font-mono text-[8.5pt]">
                    {Array.isArray(skillGroup.items) ? skillGroup.items.join(', ') : skillGroup.items}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

        {!hidden.has('experience') && experience && experience.length > 0 && (
          <section>
            {renderHeading('EXPERIENCE')}
            <div className="space-y-2">
              {experience.map((exp, idx) => (
                <div key={exp.id || idx} className="break-inside-avoid">
                  <div className="flex justify-between items-baseline font-semibold">
                    <span className="text-slate-900 font-mono text-[9.5pt]">
                      {exp.role} @ {exp.company}
                    </span>
                    <span className="font-mono text-[8.5pt] text-slate-500">
                      [{exp.start} : {exp.end || 'HEAD'}]
                    </span>
                  </div>
                  {exp.bullets && exp.bullets.length > 0 && (
                    <ul className="list-disc list-outside ml-3.5 mt-0.5 space-y-0.5 text-slate-700">
                      {exp.bullets.map((b, bIdx) => (
                        <li key={bIdx} className="leading-tight text-[9pt]">
                          {b}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {!hidden.has('projects') && projects && projects.length > 0 && (
          <section>
            {renderHeading('PROJECTS')}
            <div className="space-y-2">
              {projects.map((proj, idx) => (
                <div key={proj.id || idx} className="break-inside-avoid">
                  <div className="flex justify-between items-baseline">
                    <div className="font-bold text-slate-900 font-mono text-[9.5pt]">
                      {proj.name}
                      {proj.stack && proj.stack.length > 0 && (
                        <span className="font-mono font-normal text-slate-500 text-[8pt] ml-2">
                          #{Array.isArray(proj.stack) ? proj.stack.join(' #') : proj.stack}
                        </span>
                      )}
                    </div>
                    {proj.link && (
                      <span className="font-mono text-[8.5pt] text-slate-600">{proj.link}</span>
                    )}
                  </div>
                  {proj.subtitle && (
                    <div className="font-mono text-[8.5pt] text-slate-600 italic">
                      // {proj.subtitle}
                    </div>
                  )}
                  {proj.bullets && proj.bullets.length > 0 && (
                    <ul className="list-disc list-outside ml-3.5 mt-0.5 space-y-0.5 text-slate-700">
                      {proj.bullets.map((b, bIdx) => (
                        <li key={bIdx} className="leading-tight text-[9pt]">
                          {b}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {!hidden.has('education') && education && education.length > 0 && (
          <section>
            {renderHeading('EDUCATION')}
            <div className="space-y-1.5">
              {education.map((edu, idx) => (
                <div key={edu.id || idx} className="break-inside-avoid">
                  <div className="flex justify-between items-baseline font-medium">
                    <span className="text-slate-900 font-mono text-[9.5pt]">{edu.degree}</span>
                    <span className="font-mono text-[8.5pt] text-slate-500">
                      [{edu.start} - {edu.end || 'NOW'}]
                    </span>
                  </div>
                  <div className="flex justify-between items-baseline text-[8.5pt] text-slate-600 font-mono">
                    <span>{edu.school}</span>
                    {edu.gpa && <span className="font-semibold text-slate-700">{edu.gpa}</span>}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {custom?.filter((c) => !hidden.has(c.id)).map((sec) => (
          <section key={sec.id} className="break-inside-avoid">
            {renderHeading(sec.title.toUpperCase())}
            <ul className="list-disc list-outside ml-3.5 space-y-0.5 text-slate-700 text-[9pt]">
              {sec.bullets.map((b, bIdx) => (
                <li key={bIdx} className="leading-tight">{b}</li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
};
