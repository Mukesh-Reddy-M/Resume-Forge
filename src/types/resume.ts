export type DensityPresetId = 'compact' | 'comfortable' | 'spacious';
export type PhotoShape = 'circle' | 'square' | 'rounded';

export interface LinkItem {
  label: string;
  url: string;
}

export interface Basics {
  name: string;
  title?: string;
  email?: string;
  phone?: string;
  location?: string;
  links?: LinkItem[];
}

export interface EducationItem {
  id?: string;
  degree: string;
  school: string;
  start: string;
  end: string;
  gpa?: string;
}

export interface SkillCategory {
  id?: string;
  category: string;
  items: string[];
}

export interface ExperienceItem {
  id?: string;
  role: string;
  company: string;
  start: string;
  end: string;
  bullets: string[];
}

export interface ProjectItem {
  id?: string;
  group: string;
  name: string;
  stack: string[];
  link?: string;
  subtitle?: string;
  bullets: string[];
}

export interface CustomSection {
  id: string;
  title: string;
  bullets: string[];
}

export interface ResumeMeta {
  templateId: string;
  fontId: string;
  accent: string;
  density: DensityPresetId;
  showPhoto: boolean;
  photoUrl: string | null;
  photoShape: PhotoShape;
  sectionOrder: string[];
  hiddenSections?: string[];
}

export interface Resume {
  meta: ResumeMeta;
  basics: Basics;
  summary?: string;
  education?: EducationItem[];
  skills?: SkillCategory[];
  experience?: ExperienceItem[];
  projects?: ProjectItem[];
  custom?: CustomSection[];
}

export interface TemplateTokens {
  nameSize?: number;
  nameAlign?: 'left' | 'center' | 'right';
  headingStyle?: 'uppercase-rule' | 'accent-bar' | 'plain-small-caps' | 'bracketed-mono' | 'accent-underline' | 'serif-double-rule';
  bodySize?: number;
  entryHeader?: string;
  stackStyle?: string;
  sidebarWidthPct?: number;
  headerBg?: string;
  [key: string]: any;
}

export interface TemplateDefinition {
  id: string;
  name: string;
  isDefault: boolean;
  description: string;
  layout: 'single-column' | 'two-column-left' | 'header-block';
  supportsPhoto: boolean;
  photoPlacement: 'header-right' | 'sidebar-top' | 'header-left' | null;
  defaultFontId: string;
  defaultAccent: string;
  tokens: TemplateTokens;
}

export interface DensityPreset {
  lineHeight: number;
  sectionGapPx: number;
  entryGapPx: number;
  pagePaddingMm: number;
}

export interface FontPair {
  id: string;
  label: string;
  heading: string;
  body: string;
  mono?: string;
  google: string;
}

export interface StyleConfig {
  template: TemplateDefinition;
  density: DensityPreset;
  fontPair: FontPair;
  accent: string;
  showPhoto: boolean;
  photoUrl: string | null;
  photoShape: PhotoShape;
}
