import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export function HomeLink() {
  return <Link className="home-link" to="/" aria-label="Back to tools and guides"><ArrowLeft size={17} /> All tools</Link>;
}
