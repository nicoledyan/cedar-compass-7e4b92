import { useEffect, useState } from 'react';
import { Bot, Check, LogIn, LogOut, Sparkles } from 'lucide-react';
import { aiConfigured, analyzeDescription, getSession, sendSignInLink, signOut, supabase, type AiHomeAnalysis } from './ai';
import type { HomeRecord } from './types';

const fieldLabels: Record<string, string> = { mountainViews: 'Mountain views', condition: 'Move-in condition', yard: 'Usable yard', naturalLight: 'Natural light', layout: 'Layout and entertaining', neighborhoodFeel: 'Established character', walkability: 'Walkability', safety: 'Safety and comfort', noise: 'Quiet / low noise', amenities: 'Useful nearby places' };

export default function AiDescriptionAnalysis({ draft, setDraft }: { draft: HomeRecord; setDraft: React.Dispatch<React.SetStateAction<HomeRecord>> }) {
  const [email, setEmail] = useState('');
  const [signedInEmail, setSignedInEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<AiHomeAnalysis | null>(null);

  useEffect(() => {
    void getSession().then((session) => setSignedInEmail(session?.user.email ?? ''));
    return supabase?.auth.onAuthStateChange((_event, session) => setSignedInEmail(session?.user.email ?? '')).data.subscription.unsubscribe;
  }, []);

  const requestLink = async () => {
    setMessage(''); setLoading(true);
    try { await sendSignInLink(email.trim()); setMessage('Check your email for the secure sign-in link.'); }
    catch (error) { setMessage(error instanceof Error ? error.message : 'Sign-in failed.'); }
    finally { setLoading(false); }
  };
  const analyze = async () => {
    if (!draft.listingDescription?.trim()) { setMessage('Paste the listing description first.'); return; }
    setMessage(''); setLoading(true); setAnalysis(null);
    try { setAnalysis(await analyzeDescription(draft)); }
    catch (error) { setMessage(error instanceof Error ? error.message : 'Analysis failed.'); }
    finally { setLoading(false); }
  };
  const apply = () => {
    if (!analysis) return;
    setDraft((current) => analysis.suggestions.reduce((next, suggestion) => ({ ...next, [suggestion.field]: suggestion.rating }), current));
    setMessage(`Applied ${analysis.suggestions.length} suggested ${analysis.suggestions.length === 1 ? 'rating' : 'ratings'} to this draft. Save the assessment to keep them.`);
  };

  return <fieldset className="finder-ai-fieldset"><legend><Bot size={19}/> AI listing-description review</legend>
    <p className="finder-field-note">Paste the agent’s description. Groq will identify possible evidence and suggest ratings for your approval; it cannot verify listing claims or change the saved home by itself.</p>
    <textarea value={draft.listingDescription ?? ''} onChange={(event) => setDraft((current) => ({ ...current, listingDescription: event.target.value }))} placeholder="Paste the public listing description here…" rows={7}/>
    {!aiConfigured ? <p className="finder-ai-notice">AI setup is not deployed yet.</p> : !signedInEmail ? <div className="finder-ai-login"><input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Your approved email" aria-label="Email for AI sign in"/><button type="button" onClick={() => void requestLink()} disabled={loading || !email.trim()}><LogIn size={16}/> Email sign-in link</button></div> : <div className="finder-ai-actions"><span>Signed in as {signedInEmail}</span><button type="button" onClick={() => void analyze()} disabled={loading}><Sparkles size={16}/> {loading ? 'Analyzing…' : 'Analyze description'}</button><button className="finder-ai-signout" type="button" onClick={() => void signOut()}><LogOut size={15}/> Sign out</button></div>}
    {message && <p className="finder-ai-notice" role="status">{message}</p>}
    {analysis && <div className="finder-ai-result"><h3>{analysis.summary}</h3>
      {analysis.observations.length > 0 && <div><strong>What the description supports</strong>{analysis.observations.map((item) => <p key={item}>+ {item}</p>)}</div>}
      {analysis.cautions.length > 0 && <div><strong>What still needs checking</strong>{analysis.cautions.map((item) => <p key={item}>? {item}</p>)}</div>}
      {analysis.suggestions.length > 0 && <div className="finder-ai-suggestions"><strong>Suggested ratings</strong>{analysis.suggestions.map((item) => <p key={item.field}><b>{fieldLabels[item.field]}: {item.rating}/5</b> — {item.evidence} <small>{item.confidence} confidence</small></p>)}<button type="button" onClick={apply}><Check size={16}/> Apply all suggestions</button></div>}
    </div>}
  </fieldset>;
}
