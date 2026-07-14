import type { GuideCategory } from '../types/guide';

const filters: Array<[GuideCategory, string]> = [['all', 'Everything'], ['nature', 'Nature'], ['attraction', 'Attractions'], ['food', 'Food & drink'], ['culture', 'Arts & music'], ['event', 'Events'], ['odd', 'Odd little things'], ['dog', 'Dog-friendly']];

export function GuideFilters({ category, unfinishedOnly, onCategory, onUnfinished }: { category: GuideCategory; unfinishedOnly: boolean; onCategory: (value: GuideCategory) => void; onUnfinished: () => void }) {
  return <nav className="guide-toolbar" aria-label="Guide filters"><div className="guide-toolbar-inner">
    {filters.map(([value, label]) => <button type="button" key={value} className={category === value ? 'active' : ''} aria-pressed={category === value} onClick={() => onCategory(value)}>{label}</button>)}
    <button type="button" className={unfinishedOnly ? 'active' : ''} aria-pressed={unfinishedOnly} onClick={onUnfinished}>Unfinished only</button>
  </div></nav>;
}
