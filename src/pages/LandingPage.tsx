import { ArrowRight, Dumbbell, MapPinned } from 'lucide-react';
import { Link } from 'react-router-dom';

const cards = [
  { to: '/grow-strong', title: 'Grow Strong', description: 'A fitness planner with workouts, progress tracking, and daily checklists.', icon: Dumbbell, className: 'fitness' },
  { to: '/springs-guide', title: 'Colorado Springs Guide', description: 'A city guide with nature, food, attractions, events, and hidden gems.', icon: MapPinned, className: 'springs' }
];

export default function LandingPage() {
  return <main className="landing-page"><div className="landing-shell">
    <p className="landing-eyebrow">Nicole’s pocket collection</p>
    <h1>Tools for feeling at home<br />in your life.</h1>
    <p className="landing-intro">A small, local-first collection. Your saved progress stays in this browser.</p>
    <div className="landing-grid">{cards.map(({ to, title, description, icon: Icon, className }) => <Link className={`landing-card ${className}`} to={to} key={to}><span className="landing-icon"><Icon size={28} /></span><span><h2>{title}</h2><p>{description}</p></span><ArrowRight className="landing-arrow" aria-hidden="true" /></Link>)}</div>
    <p className="landing-note">This site is publicly accessible to anyone with the link. The unusual address reduces casual discovery; it does not make the site private.</p>
  </div></main>;
}
