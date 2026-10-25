import React from 'react';
import { TemplateProps } from './types';
import { ClassicTemplate } from './ClassicTemplate';
import { ModernSidebarTemplate } from './ModernSidebarTemplate';
import { MinimalSansTemplate } from './MinimalSansTemplate';
import { CompactTechTemplate } from './CompactTechTemplate';
import { CreativeBoldTemplate } from './CreativeBoldTemplate';
import { ExecutiveTemplate } from './ExecutiveTemplate';

export const TEMPLATE_COMPONENTS: Record<string, React.FC<TemplateProps>> = {
  'classic': ClassicTemplate,
  'modern-sidebar': ModernSidebarTemplate,
  'minimal-sans': MinimalSansTemplate,
  'compact-tech': CompactTechTemplate,
  'creative-bold': CreativeBoldTemplate,
  'executive': ExecutiveTemplate,
};

export function getTemplateComponent(templateId: string): React.FC<TemplateProps> {
  return TEMPLATE_COMPONENTS[templateId] || ClassicTemplate;
}

export * from './types';
export {
  ClassicTemplate,
  ModernSidebarTemplate,
  MinimalSansTemplate,
  CompactTechTemplate,
  CreativeBoldTemplate,
  ExecutiveTemplate,
};
