import type { GuideActivity } from '../types/guide';
import { GuideCard } from './GuideCard';

export function GuideSection({ title, note, activities, completed, onToggle }: { title: string; note: string; activities: GuideActivity[]; completed: Set<string>; onToggle: (id: string) => void }) {
  if (!activities.length) return null;
  return <section className="guide-section">
    <div className="guide-section-head"><h2>{title}</h2><div className="guide-section-note">{note}</div></div>
    <div className="guide-grid">{activities.map((activity) => <GuideCard key={activity.id} activity={activity} completed={completed.has(activity.id)} onToggle={() => onToggle(activity.id)} />)}</div>
  </section>;
}
