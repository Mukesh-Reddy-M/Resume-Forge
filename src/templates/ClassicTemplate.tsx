import React from 'react';
import { TemplateProps } from './types';

export const ClassicTemplate: React.FC<TemplateProps> = ({ data, style, isThumbnail }) => {
  const { meta, basics, summary, education, skills, experience, projects, custom } = data;
  const showPhoto = meta.showPhoto && meta.photoUrl && style.template.supportsPhoto;
  const hidden = new Set(meta.hiddenSections || []);

  const photoRadiusClass =
    meta.photoShape === 'circle'
      ? 'rounded-full'
      : meta.photoShape === 'rounded'
      ? 'rounded-lg'
      : 'rounded-none';

  // Helper for contact items
  const contactParts: React.ReactNode[] = [];
  if (basics.email) {
    contactParts.push(
      <a key="email" href={`mailto:${basics.email}`} className="hover:underline">
        {basics.email}
      </a>
    );
  }
  if (basics.phone) {
    contactParts.push(
      <a key="phone" href={`tel:${basics.phone}`} className="hover:underline">
        {basics.phone}
      </a>
    );
  }
  if (basics.location) {
    contactParts.push(<span key="loc">{basics.location}</span>);
  }
  if (basics.links && basics.links.length > 0) {
    basics.links.forEach((link, idx) => {
      if (!link.label) return;
      if (link.url) {
        contactParts.push(
          <a
            key={`link-${idx}`}
            href={link.url.startsWith('http') ? link.url : `https://${link.url}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
          >
            {link.label}
          </a>
        );
      } else {
        contactParts.push(<span key={`link-${idx}`}>{link.label}</span>);
      }
    });
  }

  // Section Heading
  const renderHeading = (title: string) => (
    <div className="border-b border-black pb-0.5 mb-2 mt-3.5 first:mt-0">
      <h2
        className="font-bold text-xs uppercase tracking-wider text-black"
        style={{ fontFamily: style.fontPair.heading }}
      >
        {title}
      </h2>
    </div>
  );

  // Group projects
  const projectGroups: Array<{ groupName: string; items: NonNullable<typeof projects> }> = [];
  if (projects && projects.length > 0) {
    let currentGroup = '';
    let currentItems: NonNullable<typeof projects> = [];
    projects.forEach((proj) => {
      const g = proj.group || '';
      if (g !== currentGroup) {
        if (currentItems.length > 0) {
          projectGroups.push({ groupName: currentGroup, items: currentItems });
        }
        currentGroup = g;
        currentItems = [proj];
      } else {
        currentItems.push(proj);
      }
    });
    if (currentItems.length > 0) {
      projectGroups.push({ groupName: currentGroup, items: currentItems });
    }
  }

  // Render individual section by id
  const renderSection = (sectionId: string) => {
    if (hidden.has(sectionId)) return null;

    if (sectionId === 'summary' && summary && summary.trim()) {
      return (
        <section key="summary" className="break-inside-avoid">
          {renderHeading('Professional Summary')}
          <p className="text-justify leading-relaxed text-black/90">{summary}</p>
        </section>
      );
    }

    if (sectionId === 'education' && education && education.length > 0) {
      return (
        <section key="education">
          {renderHeading('Education')}
          <div className="space-y-2">
            {education.map((edu, idx) => (
              <div key={edu.id || idx} className="break-inside-avoid">
                <div className="flex justify-between items-baseline font-bold text-black">
                  <span>{edu.degree}</span>
                  <span className="text-xs font-normal text-black/80">
                    {edu.start} {edu.end ? `– ${edu.end}` : ''}
                  </span>
                </div>
                <div className="flex justify-between items-baseline italic text-black/85 text-[0.95em]">
                  <span>{edu.school}</span>
                  {edu.gpa && <span className="not-italic text-xs text-black/80">{edu.gpa}</span>}
                </div>
              </div>
            ))}
          </div>
        </section>
      );
    }

    if (sectionId === 'skills' && skills && skills.length > 0) {
      return (
        <section key="skills" className="break-inside-avoid">
          {renderHeading('Technical Skills')}
          <div className="space-y-1">
            {skills.map((skillGroup, idx) => (
              <div key={skillGroup.id || idx} className="leading-snug">
                <span className="font-bold text-black">{skillGroup.category}: </span>
                <span className="text-black/90">
                  {Array.isArray(skillGroup.items) ? skillGroup.items.join(', ') : skillGroup.items}
                </span>
              </div>
            ))}
          </div>
        </section>
      );
    }

    if (sectionId === 'experience' && experience && experience.length > 0) {
      return (
        <section key="experience">
          {renderHeading('Experience')}
          <div className="space-y-3">
            {experience.map((exp, idx) => (
              <div key={exp.id || idx} className="break-inside-avoid">
                <div className="flex justify-between items-baseline font-bold text-black">
                  <span>
                    {exp.role} <span className="font-normal text-black/60">|</span> {exp.company}
                  </span>
                  <span className="text-xs font-normal text-black/80">
                    {exp.start} {exp.end ? `– ${exp.end}` : ''}
                  </span>
                </div>
                {exp.bullets && exp.bullets.length > 0 && (
                  <ul className="list-disc list-outside ml-4 mt-1 space-y-0.5 text-black/90">
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
      );
    }

    if (sectionId === 'projects' && projects && projects.length > 0) {
      return (
        <section key="projects">
          {renderHeading('Projects')}
          <div className="space-y-3">
            {projectGroups.map((groupObj, gIdx) => (
              <div key={gIdx} className="space-y-2.5">
                {groupObj.groupName && (
                  <div data-heading className="text-[11px] font-bold uppercase tracking-wider text-black/75 mt-2 border-b border-black/20 pb-0.5">
                    {groupObj.groupName}
                  </div>
                )}
                {groupObj.items?.map((proj, pIdx) => (
                  <div key={proj.id || pIdx} className="break-inside-avoid">
                    <div className="flex justify-between items-baseline">
                      <div className="font-bold text-black">
                        <span>{proj.name}</span>
                        {proj.stack && proj.stack.length > 0 && (
                          <span className="italic font-normal text-black/80 ml-1.5 text-[0.92em]">
                            | {Array.isArray(proj.stack) ? proj.stack.join(', ') : proj.stack}
                          </span>
                        )}
                      </div>
                      {proj.link && (
                        <span className="text-xs font-medium text-black/70 ml-2 shrink-0">
                          {proj.link}
                        </span>
                      )}
                    </div>
                    {proj.subtitle && (
                      <div className="italic text-xs text-black/75 mt-0.5">{proj.subtitle}</div>
                    )}
                    {proj.bullets && proj.bullets.length > 0 && (
                      <ul className="list-disc list-outside ml-4 mt-1 space-y-0.5 text-black/90">
                        {proj.bullets.map((bullet, bIdx) => (
                          <li key={bIdx} className="leading-tight">
                            {bullet}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </section>
      );
    }

    // Check custom sections
    const customSection = custom?.find((c) => c.id === sectionId);
    if (customSection && customSection.bullets && customSection.bullets.length > 0) {
      return (
        <section key={customSection.id} className="break-inside-avoid">
          {renderHeading(customSection.title)}
          <ul className="list-disc list-outside ml-4 space-y-1 text-black/90">
            {customSection.bullets.map((bullet, bIdx) => (
              <li key={bIdx} className="leading-tight">
                {bullet}
              </li>
            ))}
          </ul>
        </section>
      );
    }

    return null;
  };

  const sectionOrder = meta.sectionOrder || [
    'summary',
    'education',
    'skills',
    'experience',
    'projects',
  ];

  return (
    <div
      className="text-black bg-white w-full"
      style={{
        fontFamily: style.fontPair.body,
        fontSize: `${style.template.tokens.bodySize || 10.5}pt`,
        lineHeight: style.density.lineHeight,
      }}
    >
      {/* Header */}
      <header className="relative mb-3.5">
        <div className="text-center px-4">
          <h1
            className="text-2xl font-bold uppercase tracking-widest text-black mb-1"
            style={{
              fontFamily: style.fontPair.heading,
              color: style.accent !== '#111111' ? style.accent : '#000000',
            }}
          >
            {basics.name}
          </h1>

          {/* Contact Line */}
          {contactParts.length > 0 && (
            <div className="text-[10pt] text-black/85 flex flex-wrap justify-center items-center gap-x-2.5">
              {contactParts.map((part, index) => (
                <React.Fragment key={index}>
                  {index > 0 && <span className="text-black/40">|</span>}
                  <span>{part}</span>
                </React.Fragment>
              ))}
            </div>
          )}
        </div>

        {/* Photo positioned top-right if enabled */}
        {showPhoto && (
          <div className="absolute right-0 top-0">
            <img
              src={meta.photoUrl!}
              alt={basics.name}
              className={`w-[70px] h-[70px] object-cover border border-slate-300 shadow-xs ${photoRadiusClass}`}
            />
          </div>
        )}
      </header>

      {/* Sections in user-configured order */}
      <div className="space-y-3">
        {sectionOrder.map((sectionId) => renderSection(sectionId))}
      </div>
    </div>
  );
};
