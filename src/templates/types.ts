import { Resume, StyleConfig } from '../types/resume';

export interface TemplateProps {
  data: Resume;
  style: StyleConfig;
  className?: string;
  isThumbnail?: boolean;
}
