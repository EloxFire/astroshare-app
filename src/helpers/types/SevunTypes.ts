export type SevunModuleLevel = 'beginner' | 'intermediate' | 'advanced';

export interface SevunResource {
  id: string;
  title: string;
  description: string;
  youtubeId: string;
  duration: string; // "mm:ss"
}

export interface SevunModule {
  id: SevunModuleLevel;
  levelKey: string; // i18n key suffix
  descriptionKey: string;
  color: string;
  resources: SevunResource[];
}

export interface SevunProgress {
  beginner: Record<string, boolean>;
  intermediate: Record<string, boolean>;
  advanced: Record<string, boolean>;
}
