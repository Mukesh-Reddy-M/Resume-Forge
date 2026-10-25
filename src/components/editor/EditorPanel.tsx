import React, { useState } from 'react';
import {
  ChevronDown,
  User,
  FileText,
  GraduationCap,
  Sparkles,
  Briefcase,
  FolderGit2,
  BookmarkPlus,
  ChevronsUpDown,
} from 'lucide-react';
import { Resume } from '../../types/resume';
import { BasicsEditor } from './BasicsEditor';
import { SummaryEditor } from './SummaryEditor';
import { EducationEditor } from './EducationEditor';
import { SkillsEditor } from './SkillsEditor';
import { ExperienceEditor } from './ExperienceEditor';
import { ProjectsEditor } from './ProjectsEditor';
import { CustomSectionsEditor } from './CustomSectionsEditor';

interface EditorPanelProps {
  resume: Resume;
  onChange: (resume: Resume) => void;
}

type SectionKey =
  | 'basics'
  | 'summary'
  | 'education'
  | 'skills'
  | 'experience'
  | 'projects'
  | 'custom';

export const EditorPanel: React.FC<EditorPanelProps> = ({ resume, onChange }) => {
  // Keep open sections state. Default to open Basics and Experience
  const [openSections, setOpenSections] = useState<Record<SectionKey, boolean>>({
    basics: true,
    summary: true,
    education: false,
    skills: false,
    experience: true,
    projects: true,
    custom: false,
  });

  const toggleSection = (key: SectionKey) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const expandAll = () => {
    setOpenSections({
      basics: true,
      summary: true,
      education: true,
      skills: true,
      experience: true,
      projects: true,
      custom: true,
    });
  };

  const collapseAll = () => {
    setOpenSections({
      basics: false,
      summary: false,
      education: false,
      skills: false,
      experience: false,
      projects: false,
      custom: false,
    });
  };

  const handleAddSectionToOrder = (sectionId: string) => {
    const currentOrder = resume.meta.sectionOrder || [];
    if (!currentOrder.includes(sectionId)) {
      onChange({
        ...resume,
        meta: {
          ...resume.meta,
          sectionOrder: [...currentOrder, sectionId],
        },
      });
    }
  };

  return (
    <div className="h-full flex flex-col bg-white overflow-hidden text-slate-900 border-r border-slate-200">
      {/* Top Header */}
      <div className="px-5 py-3.5 border-b border-slate-200 flex items-center justify-between shrink-0 bg-white">
        <div>
          <h2 className="text-sm font-bold text-slate-900">Content Editor</h2>
          <p className="text-[11px] text-slate-500">Edit information live on your resume</p>
        </div>

        <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-500">
          <button
            type="button"
            onClick={expandAll}
            className="hover:text-slate-900 hover:bg-slate-100 px-2 py-1 rounded transition-colors"
          >
            Expand
          </button>
          <span>·</span>
          <button
            type="button"
            onClick={collapseAll}
            className="hover:text-slate-900 hover:bg-slate-100 px-2 py-1 rounded transition-colors"
          >
            Collapse
          </button>
        </div>
      </div>

      {/* Accordion List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {/* 1. Basics */}
        <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-2xs">
          <button
            type="button"
            onClick={() => toggleSection('basics')}
            className="w-full px-4 py-3 bg-white hover:bg-slate-50/80 flex items-center justify-between text-left transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                <User className="w-3.5 h-3.5" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-800 block">Personal Details</span>
                <span className="text-[10.5px] text-slate-500">{resume.basics.name || 'Set your name'}</span>
              </div>
            </div>
            <ChevronDown
              className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                openSections.basics ? 'rotate-180' : ''
              }`}
            />
          </button>
          {openSections.basics && (
            <div className="p-4 border-t border-slate-100 bg-white">
              <BasicsEditor
                basics={resume.basics}
                onChange={(basics) => onChange({ ...resume, basics })}
              />
            </div>
          )}
        </div>

        {/* 2. Summary */}
        <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-2xs">
          <button
            type="button"
            onClick={() => toggleSection('summary')}
            className="w-full px-4 py-3 bg-white hover:bg-slate-50/80 flex items-center justify-between text-left transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <FileText className="w-3.5 h-3.5" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-800 block">Professional Summary</span>
                <span className="text-[10.5px] text-slate-500">
                  {resume.summary ? 'Summary written' : 'Optional elevator pitch'}
                </span>
              </div>
            </div>
            <ChevronDown
              className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                openSections.summary ? 'rotate-180' : ''
              }`}
            />
          </button>
          {openSections.summary && (
            <div className="p-4 border-t border-slate-100 bg-white">
              <SummaryEditor
                summary={resume.summary || ''}
                onChange={(summary) => onChange({ ...resume, summary })}
              />
            </div>
          )}
        </div>

        {/* 3. Education */}
        <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-2xs">
          <button
            type="button"
            onClick={() => toggleSection('education')}
            className="w-full px-4 py-3 bg-white hover:bg-slate-50/80 flex items-center justify-between text-left transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                <GraduationCap className="w-3.5 h-3.5" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-800 block">Education</span>
                <span className="text-[10.5px] text-slate-500">
                  {resume.education?.length || 0} institution
                  {resume.education?.length === 1 ? '' : 's'} listed
                </span>
              </div>
            </div>
            <ChevronDown
              className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                openSections.education ? 'rotate-180' : ''
              }`}
            />
          </button>
          {openSections.education && (
            <div className="p-4 border-t border-slate-100 bg-white">
              <EducationEditor
                education={resume.education || []}
                onChange={(education) => onChange({ ...resume, education })}
              />
            </div>
          )}
        </div>

        {/* 4. Skills */}
        <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-2xs">
          <button
            type="button"
            onClick={() => toggleSection('skills')}
            className="w-full px-4 py-3 bg-white hover:bg-slate-50/80 flex items-center justify-between text-left transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-800 block">Technical Skills</span>
                <span className="text-[10.5px] text-slate-500">
                  {resume.skills?.length || 0} categories
                </span>
              </div>
            </div>
            <ChevronDown
              className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                openSections.skills ? 'rotate-180' : ''
              }`}
            />
          </button>
          {openSections.skills && (
            <div className="p-4 border-t border-slate-100 bg-white">
              <SkillsEditor
                skills={resume.skills || []}
                onChange={(skills) => onChange({ ...resume, skills })}
              />
            </div>
          )}
        </div>

        {/* 5. Experience */}
        <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-2xs">
          <button
            type="button"
            onClick={() => toggleSection('experience')}
            className="w-full px-4 py-3 bg-white hover:bg-slate-50/80 flex items-center justify-between text-left transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
                <Briefcase className="w-3.5 h-3.5" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-800 block">Work Experience</span>
                <span className="text-[10.5px] text-slate-500">
                  {resume.experience?.length || 0} position
                  {resume.experience?.length === 1 ? '' : 's'}
                </span>
              </div>
            </div>
            <ChevronDown
              className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                openSections.experience ? 'rotate-180' : ''
              }`}
            />
          </button>
          {openSections.experience && (
            <div className="p-4 border-t border-slate-100 bg-white">
              <ExperienceEditor
                experience={resume.experience || []}
                onChange={(experience) => onChange({ ...resume, experience })}
              />
            </div>
          )}
        </div>

        {/* 6. Projects */}
        <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-2xs">
          <button
            type="button"
            onClick={() => toggleSection('projects')}
            className="w-full px-4 py-3 bg-white hover:bg-slate-50/80 flex items-center justify-between text-left transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <FolderGit2 className="w-3.5 h-3.5" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-800 block">Projects & Portfolios</span>
                <span className="text-[10.5px] text-slate-500">
                  {resume.projects?.length || 0} projects
                </span>
              </div>
            </div>
            <ChevronDown
              className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                openSections.projects ? 'rotate-180' : ''
              }`}
            />
          </button>
          {openSections.projects && (
            <div className="p-4 border-t border-slate-100 bg-white">
              <ProjectsEditor
                projects={resume.projects || []}
                onChange={(projects) => onChange({ ...resume, projects })}
              />
            </div>
          )}
        </div>

        {/* 7. Custom Sections */}
        <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-2xs">
          <button
            type="button"
            onClick={() => toggleSection('custom')}
            className="w-full px-4 py-3 bg-white hover:bg-slate-50/80 flex items-center justify-between text-left transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center">
                <BookmarkPlus className="w-3.5 h-3.5" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-800 block">Custom Sections</span>
                <span className="text-[10.5px] text-slate-500">
                  {resume.custom?.length || 0} custom sections (CTFs, Awards, etc.)
                </span>
              </div>
            </div>
            <ChevronDown
              className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                openSections.custom ? 'rotate-180' : ''
              }`}
            />
          </button>
          {openSections.custom && (
            <div className="p-4 border-t border-slate-100 bg-white">
              <CustomSectionsEditor
                custom={resume.custom || []}
                onChange={(custom) => onChange({ ...resume, custom })}
                onAddSectionToOrder={handleAddSectionToOrder}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
