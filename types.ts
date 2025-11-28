export interface TrilingualText {
  en: string;
  zh: string;
  ja: string;
}

export interface Section {
  title: TrilingualText;
  content: TrilingualText;
}

export interface GeneratedCourse {
  topic: string;
  overview: TrilingualText;
  sections: Section[];
}

export interface TopicDef {
  id: string;
  name: string;
}

export interface CategoryDef {
  title: string;
  topics: TopicDef[];
}

export type LoadingState = 'idle' | 'loading' | 'success' | 'error';
