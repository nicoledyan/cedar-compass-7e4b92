import { ExternalLink, MapPin } from 'lucide-react';
import type { GuideActivity } from '../types/guide';

export function GuideCard({ activity, completed, onToggle }: { activity: GuideActivity; completed: boolean; onToggle: () => void }) {
  return <article className={`guide-card${completed ? ' completed' : ''}`}>
    <label className="guide-check-label" title={completed ? 'Mark unfinished' : 'Mark completed'}>
      <input className="guide-check" type="checkbox" checked={completed} onChange={onToggle} aria-label={`Mark ${activity.title} completed`} />
    </label>
    <h3>{activity.number}. {activity.title}</h3>
    <p>{activity.description}</p>
    <div className="guide-meta">{activity.tags.map((tag) => <span className={`guide-tag ${/free/i.test(tag) ? 'free' : /\$|paid|ticket/i.test(tag) ? 'pay' : /event|season/i.test(tag) ? 'event' : ''}`} key={tag}>{tag}</span>)}</div>
    {activity.links.length > 0 && <div className="guide-links">{activity.links.map((link) => <a href={link.href} target="_blank" rel="noreferrer" key={`${link.href}-${link.label}`}>{/map|location/i.test(link.label) ? <MapPin size={14} /> : <ExternalLink size={14} />}{link.label}</a>)}</div>}
    {activity.tip && <div className={`guide-tip${activity.warning ? ' warning' : ''}`}>{activity.tip}</div>}
  </article>;
}
