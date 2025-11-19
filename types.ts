export interface GlossaryItem {
  term: string;
  definition: string;
}

export interface SimplifiedReport {
  summary: string;
  keyPoints: string[];
  glossary: GlossaryItem[];
  disclaimer: string;
}

export enum InputMode {
  TEXT = 'TEXT',
  IMAGE = 'IMAGE'
}

export interface AnalysisState {
  loading: boolean;
  result: SimplifiedReport | null;
  error: string | null;
}
