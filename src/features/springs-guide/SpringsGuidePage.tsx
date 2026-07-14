import { useState } from 'react';
import { guideSections } from './data/activities';
import { GuideFilters } from './components/GuideFilters';
import { GuideHero } from './components/GuideHero';
import { GuideSection } from './components/GuideSection';
import { useGuideProgress } from './hooks/useGuideProgress';
import type { GuideCategory } from './types/guide';

const total = guideSections.reduce((count, section) => count + section.activities.length, 0);

export default function SpringsGuidePage() {
  const [category, setCategory] = useState<GuideCategory>('all');
  const [unfinishedOnly, setUnfinishedOnly] = useState(false);
  const { completed, toggle, clear } = useGuideProgress();
  return <div className="springs-guide">
    <GuideHero />
    <GuideFilters category={category} unfinishedOnly={unfinishedOnly} onCategory={setCategory} onUnfinished={() => setUnfinishedOnly((value) => !value)} />
    <main className="guide-main guide-shell">
      <section className="guide-intro">
        <div className="guide-panel"><h2>How I’d actually use this</h2><p>Do not treat it like a frantic tourism checklist. Pick one larger outing, one food stop and one tiny local thing each weekend. That gives you a much better feel for the city than racing through the famous attractions.</p><p className="guide-progress">{completed.size} of {total} saved activities completed</p><button type="button" onClick={clear} disabled={!completed.size}>Clear completed items</button></div>
        <div className="guide-panel"><h2>Best first five</h2><ol><li>Garden of the Gods at sunrise</li><li>Red Rock Canyon on a weekday evening</li><li>First Friday downtown</li><li>Dinner or drinks at Ivywild School</li><li>A show at The Black Sheep</li></ol></div>
      </section>
      {guideSections.map((section) => <GuideSection key={section.id} title={section.title} note={section.note} completed={completed} onToggle={toggle} activities={section.activities.filter((activity) => (category === 'all' || activity.categories.includes(category)) && (!unfinishedOnly || !completed.has(activity.id)))} />)}
      <section className="guide-panel guide-calendars"><h2>Useful live calendars</h2><p>Static guides age. These are the links worth checking when you actually need a plan:</p><ul><li><a href="https://www.peakradar.com/" target="_blank" rel="noreferrer">PeakRadar</a> for arts, classes, performances and community happenings.</li><li><a href="https://www.downtowncs.com/events/" target="_blank" rel="noreferrer">Downtown Colorado Springs events</a> for First Friday, tours and downtown programming.</li><li><a href="https://www.visitcos.com/events/" target="_blank" rel="noreferrer">Visit Colorado Springs events</a> for larger annual and visitor-friendly events.</li><li><a href="https://coloradosprings.gov/parks" target="_blank" rel="noreferrer">City parks</a> for official park information, closures and rules.</li></ul><p><strong>Boundary note:</strong> Tourism lists routinely blur city boundaries, so check the actual address before booking.</p></section>
    </main>
    <footer className="guide-shell">Made as a living checklist, not a rigid ranking. Hours, pricing, access rules and event dates can change. Official links should be treated as current source material.</footer>
  </div>;
}
