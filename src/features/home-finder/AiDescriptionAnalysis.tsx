import { useEffect, useRef, useState } from 'react';
import { Bot, Camera, Check, LogIn, LogOut, Sparkles, X } from 'lucide-react';
import { aiConfigured, analyzeListing, getSession, prepareListingPhotos, sendSignInLink, signOut, supabase, type AiHomeAnalysis, type ListingPhoto } from './ai';
import type { HomeRecord } from './types';

const fieldLabels: Record<string, string> = { mountainViews: 'Mountain views', condition: 'Move-in condition', yard: 'Usable yard', naturalLight: 'Natural light', layout: 'Layout and entertaining', neighborhoodFeel: 'Established character', walkability: 'Walkability', safety: 'Safety and comfort', noise: 'Quiet / low noise', amenities: 'Useful nearby places' };

export default function AiDescriptionAnalysis({ draft, setDraft, autoAnalyze = false, onAutoAnalyzeDone = () => {} }: { draft: HomeRecord; setDraft: React.Dispatch<React.SetStateAction<HomeRecord>>; autoAnalyze?: boolean; onAutoAnalyzeDone?: () => void }) {
  const [email, setEmail] = useState('');
  const [signedInEmail, setSignedInEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<AiHomeAnalysis | null>(null);
  const [photos, setPhotos] = useState<ListingPhoto[]>([]);
  const autoStarted = useRef(false);

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
    setMessage(''); setLoading(true); setAnalysis(null);
    try { setAnalysis(await analyzeListing(draft, photos)); }
    catch (error) { setMessage(error instanceof Error ? error.message : 'Analysis failed.'); }
    finally { setLoading(false); }
  };
  useEffect(() => {
    if (!autoAnalyze || !signedInEmail || autoStarted.current) return;
    autoStarted.current = true; onAutoAnalyzeDone(); void analyze();
  }, [autoAnalyze, signedInEmail]);
  const apply = () => {
    if (!analysis) return;
    setDraft((current) => analysis.suggestions.reduce((next, suggestion) => ({ ...next, [suggestion.field]: suggestion.rating }), current));
    setMessage(`Applied ${analysis.suggestions.length} suggested ${analysis.suggestions.length === 1 ? 'rating' : 'ratings'} to this draft. Save the assessment to keep them.`);
  };

  return <fieldset className="finder-ai-fieldset"><legend><Bot size={19}/> AI listing review</legend>
    <p className="finder-field-note">The saved prompt researches the address from public web results. Photos and a pasted description are optional and can improve the review. Groq suggests ratings for your approval and cannot change the saved home by itself.</p>
    <details className="finder-ai-optional"><summary>Optional: add description</summary><textarea value={draft.listingDescription ?? ''} onChange={(event) => setDraft((current) => ({ ...current, listingDescription: event.target.value }))} placeholder="Paste the public listing description here…" rows={6}/></details>
    <div className="finder-photo-picker"><label><Camera size={17}/><span>{photos.length ? 'Add more photos' : 'Add listing photos'}</span><input type="file" accept="image/*" multiple onChange={async (event) => { try { const next = await prepareListingPhotos(event.target.files ?? []); setPhotos((current) => [...current, ...next].slice(0, 5)); setMessage(next.length ? `${next.length} photo${next.length === 1 ? '' : 's'} ready for this analysis.` : 'Choose image files.'); } catch { setMessage('Those photos could not be prepared.'); } event.target.value = ''; }}/></label><small>Up to 5. They are analyzed once and are not saved.</small></div>
    {photos.length > 0 && <div className="finder-photo-preview">{photos.map((photo, index) => <div key={`${photo.name}-${index}`}><img src={photo.dataUrl} alt={`Selected listing ${index + 1}`}/><button type="button" onClick={() => setPhotos((current) => current.filter((_, item) => item !== index))} aria-label={`Remove photo ${index + 1}`}><X size={14}/></button></div>)}</div>}
    {!aiConfigured ? <p className="finder-ai-notice">AI setup is not deployed yet.</p> : !signedInEmail ? <div className="finder-ai-login"><input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Your approved email" aria-label="Email for AI sign in"/><button type="button" onClick={() => void requestLink()} disabled={loading || !email.trim()}><LogIn size={16}/> Email sign-in link</button></div> : <div className="finder-ai-actions"><span>Signed in as {signedInEmail}</span><button type="button" onClick={() => void analyze()} disabled={loading}><Sparkles size={16}/> {loading ? 'Researching…' : 'Research & analyze'}</button><button className="finder-ai-signout" type="button" onClick={() => void signOut()}><LogOut size={15}/> Sign out</button></div>}
    {message && <p className="finder-ai-notice" role="status">{message}</p>}
    {analysis && <div className="finder-ai-result"><h3>{analysis.summary}</h3>
      {analysis.observations.length > 0 && <div><strong>What the available evidence supports</strong>{analysis.observations.map((item) => <p key={item}>+ {item}</p>)}</div>}
      {analysis.cautions.length > 0 && <div><strong>What still needs checking</strong>{analysis.cautions.map((item) => <p key={item}>? {item}</p>)}</div>}
      {analysis.suggestions.length > 0 && <div className="finder-ai-suggestions"><strong>Suggested ratings</strong>{analysis.suggestions.map((item) => <p key={item.field}><b>{fieldLabels[item.field]}: {item.rating}/5</b> — {item.evidence} <small>{item.confidence} confidence</small></p>)}<button type="button" onClick={apply}><Check size={16}/> Apply all suggestions</button></div>}
    </div>}
  </fieldset>;
}
