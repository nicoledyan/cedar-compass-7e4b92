import { useEffect, useRef, useState } from 'react';
import { Bot, LogOut, Sparkles } from 'lucide-react';
import { aiConfigured, analyzeListing, getSession, signOut, supabase, type AiHomeAnalysis } from './ai';
import type { HomeRecord } from './types';

export default function AiDescriptionAnalysis({ home, preferences, autoAnalyze = false, onComplete }: { home: HomeRecord; preferences: string; autoAnalyze?: boolean; onComplete: (analysis: AiHomeAnalysis) => void }) {
  const [signedInEmail, setSignedInEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<AiHomeAnalysis | null>(home.aiScore === undefined ? null : { fitScore: home.aiScore, verdict: home.aiVerdict ?? '', summary: home.aiSummary ?? '', observations: home.aiObservations ?? [], cautions: home.aiCautions ?? [], sources: home.aiSources ?? [] });
  const autoStarted = useRef(false);

  useEffect(() => {
    void getSession().then((session) => setSignedInEmail(session?.user.email ?? ''));
    return supabase?.auth.onAuthStateChange((_event, session) => setSignedInEmail(session?.user.email ?? '')).data.subscription.unsubscribe;
  }, []);

  const analyze = async () => {
    setMessage(''); setLoading(true);
    try { const result = await analyzeListing(home, preferences); setAnalysis(result); onComplete(result); }
    catch (error) { setMessage(error instanceof Error ? error.message : 'The listing could not be reviewed.'); }
    finally { setLoading(false); }
  };

  useEffect(() => {
    if (!autoAnalyze || !signedInEmail || autoStarted.current) return;
    autoStarted.current = true; void analyze();
  }, [autoAnalyze, signedInEmail]);

  return <section className="finder-ai-simple" aria-live="polite">
    <div className="finder-ai-simple-head"><div><h4><Bot size={19}/> AI fit review</h4><p>Compared automatically with your saved home priorities.</p></div>{signedInEmail && <button type="button" className="finder-ai-signout" onClick={() => void signOut()}><LogOut size={15}/> Sign out</button>}</div>
    {!aiConfigured ? <p className="finder-error">AI is not configured.</p> : !signedInEmail ? <p className="finder-error">Sign in above to run the review.</p> : <button className="finder-analyze-button" type="button" onClick={() => void analyze()} disabled={loading}><Sparkles size={17}/>{loading ? 'Researching listing…' : analysis ? 'Run review again' : 'Research & score'}</button>}
    {loading && <div className="finder-ai-progress"><span/><p>Searching current MLS mirrors and comparing the home with your priorities. This can take about 20–40 seconds.</p></div>}
    {message && <p className="finder-error" role="status">{message}</p>}
    {analysis && !loading && <div className="finder-ai-summary"><div className="finder-ai-big-score"><strong>{analysis.fitScore}</strong><span>/ 100</span></div><div><p className="finder-ai-verdict">{analysis.verdict}</p><h3>{analysis.summary}</h3></div>{analysis.observations.length > 0 && <div className="finder-ai-evidence"><strong>Why it may fit</strong>{analysis.observations.slice(0, 5).map((item) => <p key={item}>+ {item}</p>)}</div>}{analysis.cautions.length > 0 && <div className="finder-ai-evidence cautions"><strong>Still worth checking</strong>{analysis.cautions.slice(0, 4).map((item) => <p key={item}>? {item}</p>)}</div>}{analysis.sources.length > 0 && <div className="finder-ai-sources"><strong>Sources used</strong>{analysis.sources.map((source) => <a href={source.url} target="_blank" rel="noreferrer" key={source.url}>{source.title}</a>)}</div>}</div>}
  </section>;
}
