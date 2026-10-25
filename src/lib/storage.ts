import {
  Resume,
  ResumeMeta,
  DensityPresetId,
  PhotoShape,
  EducationItem,
  SkillCategory,
  ExperienceItem,
  ProjectItem,
  CustomSection,
  LinkItem,
} from '../types/resume';
import { SAMPLE_RESUME, TEMPLATES, FONT_PAIRS, getTemplateById } from './data';

const STORAGE_KEY = 'resumeforge_resume_v1';

export const BUILTIN_SECTIONS = ['summary', 'education', 'skills', 'experience', 'projects'] as const;

/* ------------------------------------------------------------------ */
/* Save status + failure reporting                                     */
/* ------------------------------------------------------------------ */

type SaveStatusListener = (ok: boolean, message?: string) => void;
const saveListeners = new Set<SaveStatusListener>();

/** Subscribe to save successes/failures. Returns an unsubscribe function. */
export function subscribeSaveStatus(listener: SaveStatusListener): () => void {
  saveListeners.add(listener);
  return () => saveListeners.delete(listener);
}

function describeStorageError(e: unknown): string {
  const err = e as { name?: string; code?: number } | null;
  if (err && (err.name === 'QuotaExceededError' || err.name === 'NS_ERROR_DOM_QUOTA_REACHED' || err.code === 22 || err.code === 1014)) {
    return 'Browser storage is full. Your latest changes are NOT saved — export your resume as JSON to keep a copy.';
  }
  if (err && err.name === 'SecurityError') {
    return 'Browser storage is blocked (private mode or restricted iframe). Changes will not persist after reload — export JSON to keep a copy.';
  }
  return 'Could not save your changes to browser storage. Export your resume as JSON to keep a copy.';
}

/* ------------------------------------------------------------------ */
/* Load / save                                                         */
/* ------------------------------------------------------------------ */

function sampleCopy(): Resume {
  return validateResumeJSON(structuredClone(SAMPLE_RESUME)).resume ?? structuredClone(SAMPLE_RESUME);
}

export function loadSavedResume(): Resume {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return sampleCopy();
    const validation = validateResumeJSON(JSON.parse(raw));
    if (validation.valid && validation.resume) return validation.resume;
    console.warn('Saved resume had invalid structure, reverting to sample:', validation.errors);
    return sampleCopy();
  } catch (e) {
    console.error('Failed to load resume from localStorage:', e);
    return sampleCopy();
  }
}

let saveTimer: ReturnType<typeof setTimeout> | null = null;
let pendingResume: Resume | null = null;

export function saveResumeImmediately(resume: Resume): boolean {
  // An immediate save supersedes anything queued.
  if (saveTimer) clearTimeout(saveTimer);
  saveTimer = null;
  pendingResume = null;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(resume));
    saveListeners.forEach((l) => l(true));
    return true;
  } catch (e) {
    console.error('Failed to save resume to localStorage:', e);
    const message = describeStorageError(e);
    saveListeners.forEach((l) => l(false, message));
    return false;
  }
}

export function saveResumeDebounced(resume: Resume, delayMs = 1000): void {
  pendingResume = resume;
  if (saveTimer) clearTimeout(saveTimer);
  saveTimer = setTimeout(flushPendingSave, delayMs);
}

/** Writes any queued edit right now. Call on pagehide / tab hide / unmount. */
export function flushPendingSave(): void {
  if (saveTimer) clearTimeout(saveTimer);
  saveTimer = null;
  if (pendingResume) {
    const r = pendingResume;
    pendingResume = null;
    saveResumeImmediately(r);
  }
}

export function resetResumeToSample(): Resume {
  const clone = sampleCopy();
  saveResumeImmediately(clone);
  return clone;
}

/* ------------------------------------------------------------------ */
/* Validation + normalisation                                          */
/* ------------------------------------------------------------------ */

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  resume?: Resume;
}

const isObj = (v: unknown): v is Record<string, any> =>
  !!v && typeof v === 'object' && !Array.isArray(v);
const str = (v: unknown, fallback = ''): string => (typeof v === 'string' ? v : fallback);
const strList = (v: unknown): string[] => {
  if (Array.isArray(v)) return v.filter((x) => typeof x === 'string');
  if (typeof v === 'string') return v.split(',').map((s) => s.trim()).filter(Boolean);
  return [];
};

function normalizeHex(v: unknown): string | null {
  if (typeof v !== 'string') return null;
  const m = v.trim().match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);
  if (!m) return null;
  const h = m[1].toLowerCase();
  return '#' + (h.length === 3 ? h.split('').map((c) => c + c).join('') : h);
}

function normalizeMeta(raw: unknown, custom: CustomSection[]): ResumeMeta {
  const m = isObj(raw) ? raw : {};
  const template = TEMPLATES.find((t) => t.id === m.templateId) ?? getTemplateById('classic');
  const fontId = FONT_PAIRS.some((f) => f.id === m.fontId) ? (m.fontId as string) : template.defaultFontId;
  const accent = normalizeHex(m.accent) ?? template.defaultAccent;
  const density: DensityPresetId = ['compact', 'comfortable', 'spacious'].includes(m.density)
    ? m.density
    : 'compact';
  const photoUrl = typeof m.photoUrl === 'string' && m.photoUrl ? (m.photoUrl as string) : null;
  const photoShape: PhotoShape = ['circle', 'square', 'rounded'].includes(m.photoShape)
    ? m.photoShape
    : 'circle';
  const showPhoto = m.showPhoto === true && !!photoUrl && template.supportsPhoto;

  // Every known section id (built-ins + custom) must end up in the order,
  // otherwise it silently disappears from the resume.
  const known = [...BUILTIN_SECTIONS, ...custom.map((c) => c.id)];
  const given = Array.isArray(m.sectionOrder) ? (m.sectionOrder as unknown[]) : [];
  const order: string[] = [];
  for (const id of given) {
    if (typeof id === 'string' && known.includes(id) && !order.includes(id)) order.push(id);
  }
  for (const id of known) if (!order.includes(id)) order.push(id);

  const hiddenSections = Array.isArray(m.hiddenSections)
    ? (m.hiddenSections as unknown[]).filter((x): x is string => typeof x === 'string' && known.includes(x))
    : [];

  return {
    templateId: template.id,
    fontId,
    accent,
    density,
    showPhoto,
    photoUrl,
    photoShape,
    sectionOrder: order,
    hiddenSections,
  };
}

export function validateResumeJSON(data: any): ValidationResult {
  const errors: string[] = [];

  if (!isObj(data)) {
    return { valid: false, errors: ['JSON root must be an object'] };
  }

  if (data.meta !== undefined && !isObj(data.meta)) {
    errors.push('"meta" must be an object');
  }

  if (!isObj(data.basics)) {
    errors.push('Missing "basics" section');
  } else if (typeof data.basics.name !== 'string' || !data.basics.name.trim()) {
    errors.push('"basics.name" is required and cannot be empty');
  }

  const arrayFields: Array<[string, string]> = [
    ['education', 'an array of entries'],
    ['skills', 'an array of category objects'],
    ['experience', 'an array of entries'],
    ['projects', 'an array of entries'],
    ['custom', 'an array of custom sections'],
  ];
  for (const [key, what] of arrayFields) {
    if (data[key] != null && !Array.isArray(data[key])) errors.push(`"${key}" must be ${what}`);
  }

  if (errors.length > 0) return { valid: false, errors };

  const b = data.basics;
  const links: LinkItem[] = Array.isArray(b.links)
    ? b.links.filter(isObj).map((l: any) => ({ label: str(l.label), url: str(l.url) }))
    : [];

  const education: EducationItem[] = (data.education ?? []).filter(isObj).map((e: any) => ({
    ...e,
    degree: str(e.degree),
    school: str(e.school),
    start: str(e.start),
    end: str(e.end),
    gpa: typeof e.gpa === 'string' ? e.gpa : undefined,
  }));
  const skills: SkillCategory[] = (data.skills ?? []).filter(isObj).map((s: any) => ({
    ...s,
    category: str(s.category),
    items: strList(s.items),
  }));
  const experience: ExperienceItem[] = (data.experience ?? []).filter(isObj).map((x: any) => ({
    ...x,
    role: str(x.role),
    company: str(x.company),
    start: str(x.start),
    end: str(x.end),
    bullets: strList(x.bullets),
  }));
  const projects: ProjectItem[] = (data.projects ?? []).filter(isObj).map((p: any) => ({
    ...p,
    group: str(p.group),
    name: str(p.name),
    stack: strList(p.stack),
    link: typeof p.link === 'string' ? p.link : undefined,
    subtitle: typeof p.subtitle === 'string' ? p.subtitle : undefined,
    bullets: strList(p.bullets),
  }));

  const usedIds = new Set<string>(BUILTIN_SECTIONS);
  const custom: CustomSection[] = (data.custom ?? []).filter(isObj).map((c: any, i: number) => {
    let id = typeof c.id === 'string' && c.id ? c.id : `custom-${i + 1}`;
    while (usedIds.has(id)) id = `${id}-${i + 1}`;
    usedIds.add(id);
    return { id, title: str(c.title, 'Untitled Section'), bullets: strList(c.bullets) };
  });

  const resume: Resume = {
    meta: normalizeMeta(data.meta, custom),
    basics: {
      name: b.name,
      title: typeof b.title === 'string' ? b.title : undefined,
      email: typeof b.email === 'string' ? b.email : undefined,
      phone: typeof b.phone === 'string' ? b.phone : undefined,
      location: typeof b.location === 'string' ? b.location : undefined,
      links,
    },
    summary: typeof data.summary === 'string' ? data.summary : '',
    education,
    skills,
    experience,
    projects,
    custom,
  };

  return { valid: true, errors: [], resume };
}

export function exportResumeAsJson(resume: Resume): void {
  const jsonStr = JSON.stringify(resume, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${safeBaseName(resume)}_resume.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function safeBaseName(resume: Resume): string {
  return (resume.basics.name || 'resume').toLowerCase().replace(/[^a-z0-9_-]+/g, '_').replace(/^_+|_+$/g, '') || 'resume';
}
