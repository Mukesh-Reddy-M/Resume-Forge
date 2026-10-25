import React from 'react';
import { TemplateProps } from './types';

export const ModernSidebarTemplate: React.FC<TemplateProps> = ({ data, style }) => {
  const { meta, basics, summary, education, skills, experience, projects, custom } = data;
  const showPhoto = meta.showPhoto && meta.photoUrl && style.template.supportsPhoto;
  const hidden = new Set(meta.hiddenSections || []);

  const photoRadiusClass =
    meta.photoShape === 'circle'
      ? 'rounded-full'
      : meta.photoShape === 'rounded'
      ? 'rounded-xl'
      : 'rounded-none';

  const accentColor = style.accent || '#1f3a5f';

  // Section Heading for Main Column
  const renderMainHeading = (title: string) => (
    <div className="flex items-center gap-2 mb-2 mt-4 first:mt-0 pb-1 border-b border-slate-200">
      <div className="w-1.5 h-4 rounded-xs shrink-0" style={{ backgroundColor: accentColor }} />
      <h2
        className="font-bold text-sm tracking-wide uppercase text-slate-800"
        style={{ fontFamily: style.fontPair.heading, color: accentColor }}
      >
        {title}
      </h2>
    </div>
  );

  // Section Heading for Sidebar
  const renderSidebarHeading = (title: string) => (
    <div className="mb-2 mt-4 first:mt-0 pb-1 border-b border-white/20">
      <h2
        className="font-bold text-xs tracking-wider uppercase text-white/95"
        style={{ fontFamily: style.fontPair.heading }}
      >
        {title}
      </h2>
    </div>
  );

  return (
    <div
      className="text-slate-800 bg-white w-full min-h-full flex"
      style={{
        fontFamily: style.fontPair.body,
        fontSize: `${style.template.tokens.bodySize || 10}pt`,
        lineHeight: style.density.lineHeight,
      }}
    >
      {/* Left Sidebar */}
      <aside
        className="w-[32%] shrink-0 p-6 text-white flex flex-col gap-4 text-xs"
        style={{ backgroundColor: accentColor }}
      >
        {/* Photo if enabled */}
        {showPhoto && (
          <div className="flex justify-center mb-1">
            <img
              src={meta.photoUrl!}
              alt={basics.name}
              className={`w-24 h-24 object-cover border-2 border-white/40 shadow-sm ${photoRadiusClass}`}
            />
          </div>
        )}

        {/* Contact info in sidebar */}
        <div>
          {renderSidebarHeading('Contact')}
          <div className="space-y-1.5 text-white/90">
            {basics.email && (
              <div className="break-all">
                <span className="block text-[10px] text-white/60 uppercase">Email</span>
                <a href={`mailto:${basics.email}`} className="hover:underline">
                  {basics.email}
                </a>
              </div>
            )}
            {basics.phone && (
              <div>
                <span className="block text-[10px] text-white/60 uppercase">Phone</span>
                <a href={`tel:${basics.phone}`} className="hover:underline">
                  {basics.phone}
                </a>
              </div>
            )}
            {basics.location && (
              <div>
                <span className="block text-[10px] text-white/60 uppercase">Location</span>
                <span>{basics.location}</span>
              </div>
            )}
            {basics.links && basics.links.length > 0 && (
              <div className="pt-1 space-y-1">
                {basics.links.map((link, idx) => (
                  <div key={idx} className="truncate">
                    {link.url ? (
                      <a
                        href={link.url.startsWith('http') ? link.url : `https://${link.url}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline text-white font-medium"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <span>{link.label}</span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Skills in sidebar */}
        {!hidden.has('skills') && skills && skills.length > 0 && (
          <div>
            {renderSidebarHeading('Skills')}
            <div className="space-y-2.5">
              {skills.map((skillGroup, idx) => (
                <div key={skillGroup.id || idx}>
                  <div className="font-semibold text-white/95 text-[11px] mb-0.5">
                    {skillGroup.category}
                  </div>
                  <div className="text-white/80 leading-relaxed text-[10.5px]">
                    {Array.isArray(skillGroup.items) ? skillGroup.items.join(', ') : skillGroup.items}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Custom sections placed in sidebar if CTF / achievements */}
        {custom?.filter((c) => !hidden.has(c.id)).map((sec) => (
          <div key={sec.id}>
            {renderSidebarHeading(sec.title)}
            <ul className="list-disc list-outside ml-3.5 space-y-1 text-white/85 text-[10.5px]">
              {sec.bullets.map((b, bIdx) => (
                <li key={bIdx}>{b}</li>
              ))}
            </ul>
          </div>
        ))}
      </aside>

      {/* Main Column */}
      <main className="flex-1 p-6 space-y-4">
        {/* Name and Title */}
        <header className="pb-3 border-b border-slate-200">
          <h1
            className="text-2xl font-bold tracking-tight text-slate-900"
            style={{ fontFamily: style.fontPair.heading, color: accentColor }}
          >
            {basics.name}
          </h1>
          {basics.title && (
            <p className="text-sm font-medium text-slate-600 mt-0.5">{basics.title}</p>
          )}
        </header>

        {/* Summary */}
        {!hidden.has('summary') && summary && (
          <section className="break-inside-avoid">
            {renderMainHeading('Profile')}
            <p className="text-slate-700 leading-relaxed text-[0.98em]">{summary}</p>
          </section>
        )}

        {/* Experience */}
        {!hidden.has('experience') && experience && experience.length > 0 && (
          <section>
            {renderMainHeading('Experience')}
            <div className="space-y-3">
              {experience.map((exp, idx) => (
                <div key={exp.id || idx} className="break-inside-avoid">
                  <div className="flex justify-between items-baseline font-semibold text-slate-900">
                    <span>
                      {exp.role} <span className="text-slate-400 font-normal">at</span> {exp.company}
                    </span>
                    <span className="text-xs font-normal text-slate-500">
                      {exp.start} {exp.end ? `– ${exp.end}` : ''}
                    </span>
                  </div>
                  {exp.bullets && exp.bullets.length > 0 && (
                    <ul className="list-disc list-outside ml-4 mt-1 space-y-1 text-slate-700">
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

        {/* Projects */}
        {!hidden.has('projects') && projects && projects.length > 0 && (
          <section>
            {renderMainHeading('Key Projects')}
            <div className="space-y-3">
              {projects.map((proj, idx) => (
                <div key={proj.id || idx} className="break-inside-avoid">
                  <div className="flex justify-between items-baseline font-semibold text-slate-900">
                    <div>
                      <span>{proj.name}</span>
                      {proj.stack && proj.stack.length > 0 && (
                        <span className="text-slate-500 font-normal text-xs ml-2">
                          [{Array.isArray(proj.stack) ? proj.stack.join(', ') : proj.stack}]
                        </span>
                      )}
                    </div>
                    {proj.link && (
                      <span className="text-xs font-normal text-slate-500">{proj.link}</span>
                    )}
                  </div>
                  {proj.subtitle && (
                    <div className="text-xs italic text-slate-600">{proj.subtitle}</div>
                  )}
                  {proj.bullets && proj.bullets.length > 0 && (
                    <ul className="list-disc list-outside ml-4 mt-1 space-y-0.5 text-slate-700">
                      {proj.bullets.map((bullet, bIdx) => (
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

        {/* Education */}
        {!hidden.has('education') && education && education.length > 0 && (
          <section>
            {renderMainHeading('Education')}
            <div className="space-y-2">
              {education.map((edu, idx) => (
                <div key={edu.id || idx} className="break-inside-avoid">
                  <div className="flex justify-between items-baseline font-semibold text-slate-900">
                    <span>{edu.degree}</span>
                    <span className="text-xs font-normal text-slate-500">
                      {edu.start} {edu.end ? `– ${edu.end}` : ''}
                    </span>
                  </div>
                  <div className="flex justify-between items-baseline text-xs text-slate-600">
                    <span>{edu.school}</span>
                    {edu.gpa && <span className="font-medium text-slate-700">{edu.gpa}</span>}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
};
