import React from 'react';
import { TemplateProps } from './types';

export const MinimalSansTemplate: React.FC<TemplateProps> = ({ data, style }) => {
  const { meta, basics, summary, education, skills, experience, projects, custom } = data;
  const showPhoto = meta.showPhoto && meta.photoUrl && style.template.supportsPhoto;
  const hidden = new Set(meta.hiddenSections || []);

  const photoRadiusClass =
    meta.photoShape === 'circle'
      ? 'rounded-full'
      : meta.photoShape === 'rounded'
      ? 'rounded-lg'
      : 'rounded-none';

  const accent = style.accent || '#444444';

  const renderHeading = (title: string) => (
    <div className="mt-4 first:mt-0 mb-1.5">
      <h2
        className="text-xs font-semibold tracking-wider text-slate-500 uppercase"
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
        fontSize: `${style.template.tokens.bodySize || 10.5}pt`,
        lineHeight: style.density.lineHeight,
      }}
    >
      {/* Header: Left aligned with photo option on the left */}
      <header className="flex items-start gap-5 mb-5 pb-2">
        {showPhoto && (
          <img
            src={meta.photoUrl!}
            alt={basics.name}
            className={`w-[72px] h-[72px] object-cover shrink-0 shadow-xs border border-slate-200 ${photoRadiusClass}`}
          />
        )}
        <div className="flex-1">
          <h1
            className="text-3xl font-light tracking-tight text-slate-900"
            style={{ fontFamily: style.fontPair.heading }}
          >
            {basics.name}
          </h1>
          {basics.title && (
            <p className="text-sm font-normal text-slate-500 mt-0.5">{basics.title}</p>
          )}

          <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-slate-500 mt-2">
            {basics.email && (
              <a href={`mailto:${basics.email}`} className="hover:text-slate-900 transition-colors">
                {basics.email}
              </a>
            )}
            {basics.phone && <span>{basics.phone}</span>}
            {basics.location && <span>{basics.location}</span>}
            {basics.links?.map((link, idx) => (
              <React.Fragment key={idx}>
                {link.url ? (
                  <a
                    href={link.url.startsWith('http') ? link.url : `https://${link.url}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-slate-900 underline underline-offset-2"
                  >
                    {link.label}
                  </a>
                ) : (
                  <span>{link.label}</span>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="space-y-4">
        {!hidden.has('summary') && summary && (
          <section className="break-inside-avoid">
            {renderHeading('About')}
            <p className="text-slate-600 leading-relaxed font-light">{summary}</p>
          </section>
        )}

        {!hidden.has('experience') && experience && experience.length > 0 && (
          <section>
            {renderHeading('Experience')}
            <div className="space-y-3.5">
              {experience.map((exp, idx) => (
                <div key={exp.id || idx} className="break-inside-avoid">
                  <div className="flex justify-between items-baseline">
                    <span className="font-medium text-slate-900">
                      {exp.role} <span className="text-slate-400 font-light">—</span> {exp.company}
                    </span>
                    <span className="text-xs text-slate-400">
                      {exp.start} {exp.end ? `– ${exp.end}` : ''}
                    </span>
                  </div>
                  {exp.bullets && exp.bullets.length > 0 && (
                    <ul className="list-disc list-outside ml-4 mt-1 space-y-0.5 text-slate-600">
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
            {renderHeading('Projects')}
            <div className="space-y-3">
              {projects.map((proj, idx) => (
                <div key={proj.id || idx} className="break-inside-avoid">
                  <div className="flex justify-between items-baseline">
                    <div className="font-medium text-slate-900">
                      <span>{proj.name}</span>
                      {proj.stack && proj.stack.length > 0 && (
                        <span className="text-xs text-slate-400 font-normal ml-2">
                          ({Array.isArray(proj.stack) ? proj.stack.join(', ') : proj.stack})
                        </span>
                      )}
                    </div>
                    {proj.link && (
                      <span className="text-xs text-slate-400">{proj.link}</span>
                    )}
                  </div>
                  {proj.subtitle && (
                    <div className="text-xs text-slate-500 italic mt-0.5">{proj.subtitle}</div>
                  )}
                  {proj.bullets && proj.bullets.length > 0 && (
                    <ul className="list-disc list-outside ml-4 mt-1 space-y-0.5 text-slate-600">
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
            {renderHeading('Education')}
            <div className="space-y-2">
              {education.map((edu, idx) => (
                <div key={edu.id || idx} className="break-inside-avoid">
                  <div className="flex justify-between items-baseline font-medium text-slate-900">
                    <span>{edu.degree}</span>
                    <span className="text-xs text-slate-400">
                      {edu.start} {edu.end ? `– ${edu.end}` : ''}
                    </span>
                  </div>
                  <div className="flex justify-between items-baseline text-xs text-slate-500">
                    <span>{edu.school}</span>
                    {edu.gpa && <span>{edu.gpa}</span>}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {!hidden.has('skills') && skills && skills.length > 0 && (
          <section className="break-inside-avoid">
            {renderHeading('Skills')}
            <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs text-slate-600">
              {skills.map((skillGroup, idx) => (
                <div key={skillGroup.id || idx}>
                  <span className="font-medium text-slate-800">{skillGroup.category}: </span>
                  <span>{Array.isArray(skillGroup.items) ? skillGroup.items.join(', ') : skillGroup.items}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {custom?.filter((c) => !hidden.has(c.id)).map((sec) => (
          <section key={sec.id} className="break-inside-avoid">
            {renderHeading(sec.title)}
            <ul className="list-disc list-outside ml-4 space-y-1 text-slate-600 text-xs">
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
