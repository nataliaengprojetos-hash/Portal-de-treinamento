export interface ContentItem {
  id: string;
  title: string;
  description: string;
  type: 'video' | 'manual';
  duration?: string;
  pages?: string;
  url?: string;
  featured?: boolean;
}

export interface Accordion {
  id: string;
  title: string;
  categoryId: string;
  description: string;
  contents: ContentItem[];
}

export interface TrainingCategory {
  id: string;
  name: string;
  groups: string[];
}

export interface FeaturedContent {
  id: string;
  title: string;
  subtitle: string;
  type: 'video' | 'manual';
  duration: string;
  categoryId: string;
}
