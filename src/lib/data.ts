import sampleData from '../data/john_doe_classic.json';
import templatesData from '../data/templates.json';
import fontsData from '../data/fonts.json';
import resumeSchema from '../data/resume.schema.json';
import { Resume, TemplateDefinition, DensityPreset, FontPair, DensityPresetId } from '../types/resume';

export const SAMPLE_RESUME: Resume = sampleData as unknown as Resume;

export const TEMPLATES: TemplateDefinition[] = templatesData.templates as unknown as TemplateDefinition[];

export const DENSITY_PRESETS: Record<DensityPresetId, DensityPreset> = templatesData.densityPresets as unknown as Record<DensityPresetId, DensityPreset>;

export const ACCENT_PALETTE: string[] = templatesData.accentPalette;

export const FONT_PAIRS: FontPair[] = fontsData.fontPairs as unknown as FontPair[];

export const RESUME_SCHEMA = resumeSchema;

export function getTemplateById(id: string): TemplateDefinition {
  const found = TEMPLATES.find(t => t.id === id);
  return found || TEMPLATES[0];
}

export function getFontPairById(id: string): FontPair {
  const found = FONT_PAIRS.find(f => f.id === id);
  return found || FONT_PAIRS[0];
}

export function getDensityPreset(id: DensityPresetId): DensityPreset {
  return DENSITY_PRESETS[id] || DENSITY_PRESETS.compact;
}
