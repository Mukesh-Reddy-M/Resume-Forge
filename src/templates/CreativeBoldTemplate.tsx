import React from 'react';
import { TemplateProps } from './types';

export const CreativeBoldTemplate: React.FC<TemplateProps> = ({ data, style }) => {
  const { meta, basics, summary, education, skills, experience, projects, custom } = data;
  const showPhoto = meta.showPhoto && meta.photoUrl && style.template.supportsPhoto;
  const hidden = new Set(meta.hiddenSections || []);
  const accent = style.accent || '#7c3aed';
  const pagePad = style.density.pagePaddingMm || 15;

  const photoRadiusClass =
    meta.photoShape === 'square'
      ? 'rounded-none'
      : meta.photoShape === 'rounded'
      ? 'rounded-2xl'
      : 'rounded-full';

  const renderHeading = (title: string) => (
    <div className="mt-4 first:mt-0 mb-2 border-b-2 pb-1" style={{ borderColor: accent }}>
      <h2
        className="font-bold text-sm tracking-wide uppercase"
        style={{ fontFamily: style.fontPair.heading, color: accent }}
      >
        {title}
      </h2>
    </div>
  );

  return (
    <div
      className="text-slate-800 bg-white w-full"
      style={{
        fontFamily: style.fontPair.body,
        fontSize: `${style.template.tokens.bodySize || 10}pt`,
        lineHeight: style.density.lineHeight,
      }}
    >
      {/* Full-width colored header block */}
      <header
        className="px-8 py-6 mb-5 text-white flex items-center justify-between gap-6"
        style={{
          backgroundColor: accent,
          // Full-bleed on page 1: pull the block out over the page margin,
          // whatever the density preset's margin is.
          margin: `-${pagePad}mm -${pagePad}mm 1.25rem`,
        }}
      >
        <div className="flex-1">
          <h1
            className="text-3xl font-extrabold tracking-tight text-white mb-1"
            style={{ fontFamily: style.fontPair.heading }}
          >
            {basics.name}
          </h1>
          {basics.title && (
            <p className="text-white/80 text-sm font-medium tracking-wide mb-2">
              {basics.title}
            </p>
          )}

          <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-white/90">
            {basics.email && (
              <a href={`mailto:${basics.email}`} className="hover:underline">
                {basics.email}
              </a>
            )}
            {basics.phone && <span>• {basics.phone}</span>}
            {basics.location && <span>• {basics.location}</span>}
            {basics.links?.map((link, idx) => (
              <span key={idx}>
                •{' '}
                {link.url ? (
                  <a
                    href={link.url.startsWith('http') ? link.url : `https://${link.url}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline font-medium"
                  >
                    {link.label}
                  </a>
                ) : (
                  link.label
                )}
              </span>
            ))}
          </div>
        </div>

        {showPhoto && (
          <div className="shrink-0">
            <img
              src={meta.photoUrl!}
              alt={basics.name}
              className={`w-20 h-20 object-cover border-2 border-white/60 shadow-md ${photoRadiusClass}`}
            />
          </div>
        )}
      </header>

      {/* Main Content Area */}
      <div className="space-y-4">
        {!hidden.has('summary') && summary && (
          <section className="break-inside-avoid">
            {renderHeading('About Me')}
            <p className="text-slate-700 leading-relaxed">{summary}</p>
          </section>
        )}

        {!hidden.has('skills') && skills && skills.length > 0 && (
          <section className="break-inside-avoid">
            {renderHeading('Core Competencies')}
            <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs">
              {skills.map((skillGroup, idx) => (
                <div key={skillGroup.id || idx}>
                  <span className="font-bold text-slate-900">{skillGroup.category}: </span>
                  <span className="text-slate-700">
                    {Array.isArray(skillGroup.items) ? skillGroup.items.join(', ') : skillGroup.items}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

        {!hidden.has('experience') && experience && experience.length > 0 && (
          <section>
            {renderHeading('Professional Experience')}
            <div className="space-y-3">
              {experience.map((exp, idx) => (
                <div key={exp.id || idx} className="break-inside-avoid">
                  <div className="flex justify-between items-baseline font-bold text-slate-900">
                    <span>
                      {exp.role} <span className="text-slate-400 font-normal">|</span> {exp.company}
                    </span>
                    <span className="text-xs font-semibold text-slate-500">
                      {exp.start} {exp.end ? `– ${exp.end}` : ''}
                    </span>
                  </div>
                  {exp.bullets && exp.bullets.length > 0 && (
                    <ul className="list-disc list-outside ml-4 mt-1 space-y-0.5 text-slate-700">
                      {exp.bullets.map((bullet, bIdx) => (
                        <li key={bIdx} className="leading-snug">
                          {bullet}
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
            {renderHeading('Highlighted Projects')}
            <div className="space-y-3">
              {projects.map((proj, idx) => (
                <div key={proj.id || idx} className="break-inside-avoid">
                  <div className="flex justify-between items-baseline font-bold text-slate-900">
                    <div>
                      <span>{proj.name}</span>
                      {proj.stack && proj.stack.length > 0 && (
                        <span className="font-normal text-xs text-slate-500 ml-2">
                          [{Array.isArray(proj.stack) ? proj.stack.join(', ') : proj.stack}]
                        </span>
                      )}
                    </div>
                    {proj.link && (
                      <span className="text-xs font-medium text-slate-500">{proj.link}</span>
                    )}
                  </div>
                  {proj.subtitle && (
                    <div className="text-xs italic text-slate-600 mt-0.5">{proj.subtitle}</div>
                  )}
                  {proj.bullets && proj.bullets.length > 0 && (
                    <ul className="list-disc list-outside ml-4 mt-1 space-y-0.5 text-slate-700">
                      {proj.bullets.map((b, bIdx) => (
                        <li key={bIdx} className="leading-snug">
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
            {renderHeading('Education & Certifications')}
            <div className="space-y-2">
              {education.map((edu, idx) => (
                <div key={edu.id || idx} className="break-inside-avoid">
                  <div className="flex justify-between items-baseline font-bold text-slate-900">
                    <span>{edu.degree}</span>
                    <span className="text-xs font-normal text-slate-500">
                      {edu.start} {edu.end ? `– ${edu.end}` : ''}
                    </span>
                  </div>
                  <div className="flex justify-between items-baseline text-xs text-slate-600">
                    <span>{edu.school}</span>
                    {edu.gpa && <span className="font-medium text-slate-800">{edu.gpa}</span>}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {custom?.filter((c) => !hidden.has(c.id)).map((sec) => (
          <section key={sec.id} className="break-inside-avoid">
            {renderHeading(sec.title)}
            <ul className="list-disc list-outside ml-4 space-y-1 text-slate-700 text-xs">
              {sec.bullets.map((b, bIdx) => (
                <li key={bIdx} className="leading-snug">{b}</li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
};
