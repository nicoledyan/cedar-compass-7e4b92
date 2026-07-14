import { useEffect, useMemo, useRef, useState } from 'react';
import { ClipboardPaste, Download, ExternalLink, FileJson, Home, LogIn, LogOut, Plus, Share2, Trash2, Upload, X } from 'lucide-react';
import { blankHome, HOME_STORAGE_KEY, validZillowUrl } from './homeFinder';
import { exportCsv, exportJson, parseBackup } from './backup';
import AiDescriptionAnalysis from './AiDescriptionAnalysis';
import { aiConfigured, getSession, signInWithGoogle, signOut, supabase, type AiHomeAnalysis } from './ai';
import type { HomeRecord } from './types';
import './home-finder.css';
import './home-finder-auth.css';
import './home-finder-refresh.css';

function loadHomes(): HomeRecord[] { try { const value = JSON.parse(localStorage.getItem(HOME_STORAGE_KEY) ?? '[]'); return Array.isArray(value) ? value : []; } catch { return []; } }
const PREFERENCES_KEY = 'cedar-compass:home-finder:preferences:v1';
const DEFAULT_PREFERENCES = `Budget is $450,000 or less.
At least 3 bedrooms and 1.5 bathrooms.
Needs a garage or other genuinely useful off-street parking.
Prefer no HOA, or only a minimal HOA.
Low wildfire and flood risk are important.
Strong preference for mountain or Pikes Peak views.
Move-in ready, with a usable fenced yard, good natural light, and a comfortable layout for entertaining.
Prefer an established, quiet neighborhood with useful places nearby.
Convenient access to Downtown, Garden of the Gods, Old Colorado City, Red Rock Canyon, Manitou Springs, and The Black Sheep.`;

export default function HomeFinderPage() {
  const [homes, setHomes] = useState<HomeRecord[]>(loadHomes);
  const [url, setUrl] = useState('');
  const [urlError, setUrlError] = useState('');
  const [backupMessage, setBackupMessage] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [autoAnalyzeId, setAutoAnalyzeId] = useState<string | null>(null);
  const [signedInEmail, setSignedInEmail] = useState('');
  const [authReady, setAuthReady] = useState(false);
  const [authMessage, setAuthMessage] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [preferences, setPreferences] = useState(() => localStorage.getItem(PREFERENCES_KEY) || DEFAULT_PREFERENCES);
  const fileInput = useRef<HTMLInputElement>(null);
  const ranked = useMemo(() => [...homes].sort((a, b) => (b.aiScore ?? -1) - (a.aiScore ?? -1)), [homes]);

  useEffect(() => { localStorage.setItem(HOME_STORAGE_KEY, JSON.stringify(homes)); }, [homes]);
  useEffect(() => { localStorage.setItem(PREFERENCES_KEY, preferences); }, [preferences]);
  useEffect(() => {
    void getSession().then((session) => { setSignedInEmail(session?.user.email ?? ''); setAuthReady(true); });
    return supabase?.auth.onAuthStateChange((_event, session) => { setSignedInEmail(session?.user.email ?? ''); setAuthReady(true); }).data.subscription.unsubscribe;
  }, []);
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const shared = params.get('url') || params.get('text')?.match(/https?:\/\/\S+/)?.[0] || '';
    if (validZillowUrl(shared)) setUrl(shared);
  }, []);

  const addHome = () => {
    if (!validZillowUrl(url)) { setUrlError('Paste a complete zillow.com listing URL.'); return; }
    if (homes.some((home) => home.zillowUrl.replace(/\/$/, '') === url.trim().replace(/\/$/, ''))) { setUrlError('That Zillow listing is already saved. Open it below and run the review again.'); return; }
    const home = blankHome(url);
    setHomes((current) => [home, ...current]); setUrl(''); setUrlError(''); setEditingId(home.id); setAutoAnalyzeId(home.id);
  };
  const update = (next: HomeRecord) => setHomes((current) => current.map((home) => home.id === next.id ? { ...next, updatedAt: new Date().toISOString() } : home));
  const remove = (home: HomeRecord) => { if (window.confirm(`Delete ${home.address}?`)) { setHomes((current) => current.filter((item) => item.id !== home.id)); if (editingId === home.id) setEditingId(null); } };
  const pasteLink = async () => { try { const value = await navigator.clipboard.readText(); setUrl(value); setUrlError(validZillowUrl(value) ? '' : 'The clipboard does not contain a Zillow listing link.'); } catch { setUrlError('Press and hold in the link box, then choose Paste.'); } };
  const googleSignIn = async () => { setAuthMessage(''); setAuthLoading(true); try { await signInWithGoogle(); } catch (error) { setAuthMessage(error instanceof Error ? error.message : 'Sign-in failed.'); setAuthLoading(false); } };
  const restore = async (file?: File) => {
    if (!file) return;
    try { const restored = parseBackup(await file.text()); if (!window.confirm(`Replace this browser's saved homes with ${restored.length} from the backup?`)) return; setHomes(restored); setEditingId(null); setBackupMessage(`Restored ${restored.length} saved homes.`); }
    catch (error) { setBackupMessage(error instanceof Error ? error.message : 'The backup could not be restored.'); }
    finally { if (fileInput.current) fileInput.current.value = ''; }
  };

  return <main className="finder-page"><div className="finder-shell">
    <header className="finder-hero"><p className="finder-eyebrow">Cedar Compass · personal home research</p><h1>Is this home<br/><em>really a fit?</em></h1><p>Paste a Zillow link. Cedar Compass researches matching public listings, separates confirmed facts from unknowns, and scores the home against what matters to you.</p><div className="finder-hero-promises"><span>Evidence before opinions</span><span>Unknown is not “no”</span><span>Built for quick phone sharing</span></div></header>
    {!authReady ? <section className="finder-import"><p>Checking secure AI sign-in…</p></section> : !aiConfigured ? <section className="finder-import"><p className="finder-error">AI setup is not available.</p></section> : !signedInEmail ? <section className="finder-import finder-auth-gate"><div><label>Sign in before adding a listing</label><p>Use your existing Google account. No authentication email or separate password is needed.</p></div><button className="finder-google-button" type="button" disabled={authLoading} onClick={() => void googleSignIn()}><LogIn size={18}/>{authLoading ? 'Opening Google…' : 'Continue with Google'}</button>{authMessage && <p className="finder-error">{authMessage}</p>}</section> : <section className="finder-import"><div className="finder-import-heading"><div><label htmlFor="zillow-url">Add a listing</label><p>Paste one Zillow link. The AI review starts automatically.</p></div><button type="button" className="finder-inline-signout" onClick={() => void signOut()}><LogOut size={14}/> Sign out</button></div><div className="finder-import-row"><input id="zillow-url" type="url" inputMode="url" value={url} onChange={(event) => { setUrl(event.target.value); setUrlError(''); }} onKeyDown={(event) => { if (event.key === 'Enter') addHome(); }} placeholder="https://www.zillow.com/homedetails/..."/><button className="finder-paste-button" type="button" onClick={() => void pasteLink()}><ClipboardPaste size={18}/> Paste link</button><button type="button" onClick={addHome}><Plus size={18}/> Get AI score</button></div>{urlError && <p className="finder-error">{urlError}</p>}<p className="finder-share-note"><Share2 size={14}/> No assessment form—just the link, summary, and score.</p></section>}
    {signedInEmail && <details className="finder-preferences"><summary>My home priorities <span>Edit the reusable scoring prompt</span></summary><div><p>This is your saved brief. Be specific about must-haves, nice-to-haves, and deal breakers; it is automatically used for every review.</p><textarea value={preferences} onChange={(event) => setPreferences(event.target.value)} rows={10}/><small>Saved on this device. Rerun a review after changing it.</small></div></details>}
    <details className="finder-backup"><summary>Backups & exports</summary><div className="finder-backup-inner"><div><h2>Keep a copy</h2><p>Download or restore the reviews saved in this browser.</p></div><div className="finder-backup-actions"><button type="button" onClick={() => exportJson(homes)} disabled={!homes.length}><FileJson size={17}/> JSON backup</button><button type="button" onClick={() => exportCsv(homes)} disabled={!homes.length}><Download size={17}/> Export CSV</button><button type="button" onClick={() => fileInput.current?.click()}><Upload size={17}/> Restore JSON</button><input ref={fileInput} type="file" accept="application/json,.json" onChange={(event) => void restore(event.target.files?.[0])}/></div></div>{backupMessage && <p className="finder-backup-message">{backupMessage}</p>}</details>
    {!ranked.length ? <section className="finder-empty"><Home size={32}/><h2>No homes reviewed yet</h2><p>Paste a Zillow listing above to get its AI fit score.</p></section> : <section><div className="finder-list-head"><h2>{ranked.length} AI-reviewed {ranked.length === 1 ? 'home' : 'homes'}</h2><span>Highest fit first</span></div><div className="finder-grid">{ranked.map((home) => <HomeCard key={home.id} home={home} preferences={preferences} editing={editingId === home.id} autoAnalyze={autoAnalyzeId === home.id} onEdit={() => setEditingId(editingId === home.id ? null : home.id)} onUpdate={update} onDelete={() => remove(home)}/>)}</div></section>}
    <p className="finder-privacy">Links, AI summaries, and scores are saved only in this browser. Your private Supabase function sends the link and extracted address to Gemini for public-web research. Verify important facts against the live listing.</p>
  </div></main>;
}

function HomeCard({ home, preferences, editing, autoAnalyze, onEdit, onUpdate, onDelete }: { home: HomeRecord; preferences: string; editing: boolean; autoAnalyze: boolean; onEdit: () => void; onUpdate: (home: HomeRecord) => void; onDelete: () => void }) {
  const complete = (analysis: AiHomeAnalysis) => {
    const currentConfidence = home.aiConfidence ?? -1;
    // A flaky public search must not silently replace a richer prior review with a thin result.
    if (analysis.confidence + 15 < currentConfidence) return;
    onUpdate({ ...home, aiScore: analysis.fitScore, aiVerdict: analysis.verdict, aiSummary: analysis.summary, aiObservations: analysis.observations, aiCautions: analysis.cautions, aiConfidence: analysis.confidence, aiConfirmedFacts: analysis.confirmedFacts, aiUnknowns: analysis.unknowns, aiSources: analysis.sources });
  };
  const score = home.aiScore;
  return <article className="finder-card finder-ai-card"><div className="finder-card-top"><div className={`finder-score score-${score === undefined ? 'pending' : score >= 75 ? 'high' : score >= 60 ? 'mid' : 'low'}`}><strong>{score ?? '—'}</strong><span>fit score</span></div><div className="finder-card-title"><h3>{home.address}</h3><div className="finder-card-meta"><a href={home.zillowUrl} target="_blank" rel="noreferrer">Open listing <ExternalLink size={14}/></a>{home.aiConfidence !== undefined && <span>{home.aiConfidence}% evidence confidence</span>}</div>{home.aiVerdict && <p className="finder-card-verdict">{home.aiVerdict}</p>}</div><button className="finder-icon-button" type="button" onClick={onEdit}>{editing ? <X size={19}/> : <span>{score === undefined ? 'Review' : 'Full review'}</span>}</button></div>{home.aiSummary && !editing && <p className="finder-card-summary">{home.aiSummary}</p>}{editing && <><AiDescriptionAnalysis home={home} preferences={preferences} autoAnalyze={autoAnalyze} onComplete={complete}/><button className="finder-delete finder-ai-delete" type="button" onClick={onDelete}><Trash2 size={16}/> Delete listing</button></>}</article>;
}
