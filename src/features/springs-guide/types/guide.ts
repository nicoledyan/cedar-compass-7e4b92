export type GuideCategory = 'all' | 'nature' | 'attraction' | 'food' | 'culture' | 'event' | 'odd' | 'dog';

export interface GuideLink { href: string; label: string }
export interface GuideActivity {
  id: string;
  number: number;
  title: string;
  description: string;
  categories: Exclude<GuideCategory, 'all'>[];
  tags: string[];
  links: GuideLink[];
  tip?: string;
  warning?: boolean;
}
export interface GuideSectionData {
  id: string;
  title: string;
  note: string;
  activities: GuideActivity[];
}
