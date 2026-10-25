import React from 'react';
import { TemplateProps } from './types';

export const ExecutiveTemplate: React.FC<TemplateProps> = ({ data, style }) => {
  const { meta, basics, summary, education, skills, experience, projects, custom } = data;
  const showPhoto = meta.showPhoto && meta.photoUrl && style.template.supportsPhoto;
  const hidden = new Set(meta.hiddenSections || []);
  const accent = style.accent || '#7a1f2b';

  const photoRadiusClass =
    meta.photoShape === 'circle'
      ? 'rounded-full'
      : meta.photoShape === 'rounded'
      ? 'rounded-lg'
      : 'rounded-none';

  // Elegant double-line heading
  const renderHeading = (title: string) => (
    <div className="mt-4 first:mt-0 mb-2 border-t-2 border-b border-black py-0.5">
      <h2
        className="text-xs font-bold uppercase tracking-widest text-center"
        style={{ fontFamily: style.fontPair.heading, color: accent }}
      >
        {title}
      </h2>
    </div>
  );

  return (
    <div
      className="text-slate-900 bg-white w-full"
      style={{
        fontFamily: style.fontPair.body,
        fontSize: `${style.template.tokens.bodySize || 10.5}pt`,
        lineHeight: style.density.lineHeight,
      }}
    >
      {/* Header: Left aligned with photo top-left */}
      <header className="flex items-center gap-6 mb-4 pb-3 border-b border-slate-300">
        {showPhoto && (
          <img
            src={meta.photoUrl!}
            alt={basics.name}
            className={`w-[74px] h-[74px] object-cover shrink-0 border border-slate-400 shadow-xs ${photoRadiusClass}`}
          />
        )}
        <div className="flex-1">
          <h1
            className="text-2xl font-bold tracking-normal uppercase"
            style={{ fontFamily: style.fontPair.heading, color: accent }}
          >
            {basics.name}
          </h1>
          {basics.title && (
            <p className="text-xs uppercase tracking-wider text-slate-600 font-semibold mt-0.5">
              {basics.title}
            </p>
          )}

          <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-slate-700 mt-1.5 font-normal">
            {basics.email && (
              <a href={`mailto:${basics.email}`} className="hover:underline">
                {basics.email}
              </a>
            )}
            {basics.phone && <span>| {basics.phone}</span>}
            {basics.location && <span>| {basics.location}</span>}
            {basics.links?.map((link, idx) => (
              <span key={idx}>
                |{' '}
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
      </header>

      {/* Content */}
      <div className="space-y-3.5">
        {!hidden.has('summary') && summary && (
          <section className="break-inside-avoid">
            {renderHeading('Executive Profile')}
            <p className="text-justify leading-relaxed text-slate-800">{summary}</p>
          </section>
        )}

        {!hidden.has('experience') && experience && experience.length > 0 && (
          <section>
            {renderHeading('Professional History')}
            <div className="space-y-3">
              {experience.map((exp, idx) => (
                <div key={exp.id || idx} className="break-inside-avoid">
                  <div className="flex justify-between items-baseline font-bold">
                    <span>
                      {exp.role}, <span className="font-medium text-slate-700">{exp.company}</span>
                    </span>
                    <span className="text-xs font-normal text-slate-600">
                      {exp.start} {exp.end ? `– ${exp.end}` : ''}
                    </span>
                  </div>
                  {exp.bullets && exp.bullets.length > 0 && (
                    <ul className="list-disc list-outside ml-4 mt-1 space-y-0.5 text-slate-800">
                      {exp.bullets.map((bullet, bIdx) => (
                        <li key={bIdx} className="leading-tight">
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
            {renderHeading('Key Initiatives & Projects')}
            <div className="space-y-3">
              {projects.map((proj, idx) => (
                <div key={proj.id || idx} className="break-inside-avoid">
                  <div className="flex justify-between items-baseline">
                    <div className="font-bold">
                      <span>{proj.name}</span>
                      {proj.stack && proj.stack.length > 0 && (
                        <span className="italic font-normal text-slate-600 text-xs ml-2">
                          — {Array.isArray(proj.stack) ? proj.stack.join(', ') : proj.stack}
                        </span>
                      )}
                    </div>
                    {proj.link && (
                      <span className="text-xs font-medium text-slate-600">{proj.link}</span>
                    )}
                  </div>
                  {proj.subtitle && (
                    <div className="italic text-xs text-slate-600 mt-0.5">{proj.subtitle}</div>
                  )}
                  {proj.bullets && proj.bullets.length > 0 && (
                    <ul className="list-disc list-outside ml-4 mt-1 space-y-0.5 text-slate-800">
                      {proj.bullets.map((b, bIdx) => (
                        <li key={bIdx} className="leading-tight">
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

        {!hidden.has('skills') && skills && skills.length > 0 && (
          <section className="break-inside-avoid">
            {renderHeading('Areas of Expertise')}
            <div className="space-y-1">
              {skills.map((skillGroup, idx) => (
                <div key={skillGroup.id || idx} className="leading-snug">
                  <span className="font-bold">{skillGroup.category}: </span>
                  <span className="text-slate-800">
                    {Array.isArray(skillGroup.items) ? skillGroup.items.join(', ') : skillGroup.items}
                  </span>
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
                  <div className="flex justify-between items-baseline font-bold">
                    <span>{edu.degree}</span>
                    <span className="text-xs font-normal text-slate-600">
                      {edu.start} {edu.end ? `– ${edu.end}` : ''}
                    </span>
                  </div>
                  <div className="flex justify-between items-baseline text-xs text-slate-700 italic">
                    <span>{edu.school}</span>
                    {edu.gpa && <span className="not-italic text-slate-800 font-medium">{edu.gpa}</span>}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {custom?.filter((c) => !hidden.has(c.id)).map((sec) => (
          <section key={sec.id} className="break-inside-avoid">
            {renderHeading(sec.title)}
            <ul className="list-disc list-outside ml-4 space-y-1 text-slate-800 text-xs">
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
