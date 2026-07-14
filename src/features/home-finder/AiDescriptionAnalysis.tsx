import { useEffect, useRef, useState } from 'react';
import { AlertTriangle, Bot, CheckCircle2, HelpCircle, LogOut, ShieldCheck, Sparkles } from 'lucide-react';
import { aiConfigured, analyzeListing, getSession, signOut, supabase, type AiHomeAnalysis } from './ai';
import type { HomeRecord } from './types';

export default function AiDescriptionAnalysis({ home, preferences, autoAnalyze = false, onComplete }: { home: HomeRecord; preferences: string; autoAnalyze?: boolean; onComplete: (analysis: AiHomeAnalysis) => void }) {
  const [signedInEmail, setSignedInEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<AiHomeAnalysis | null>(home.aiScore === undefined ? null : { fitScore: home.aiScore, verdict: home.aiVerdict ?? '', summary: home.aiSummary ?? '', observations: home.aiObservations ?? [], cautions: home.aiCautions ?? [], confidence: home.aiConfidence ?? 0, confirmedFacts: home.aiConfirmedFacts ?? [], unknowns: home.aiUnknowns ?? [], sources: home.aiSources ?? [] });
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
    {analysis && !loading && <div className="finder-ai-summary">
      <div className="finder-ai-big-score"><strong>{analysis.fitScore}</strong><span>/ 100 fit</span></div>
      <div className="finder-ai-intro"><p className="finder-ai-verdict">{analysis.verdict}</p><h3>{analysis.summary}</h3><div className="finder-confidence"><ShieldCheck size={16}/><span><strong>{analysis.confidence}% evidence confidence</strong> · Score and evidence certainty are separate.</span></div></div>
      {analysis.observations.length > 0 && <section className="finder-review-section strengths"><h4><CheckCircle2 size={18}/> Why it fits</h4>{analysis.observations.map((item) => <p key={item}>{item}</p>)}</section>}
      {analysis.cautions.length > 0 && <section className="finder-review-section cautions"><h4><AlertTriangle size={18}/> Tradeoffs & checks</h4>{analysis.cautions.map((item) => <p key={item}>{item}</p>)}</section>}
      {analysis.confirmedFacts.length > 0 && <section className="finder-fact-section"><div className="finder-section-heading"><div><span>Evidence ledger</span><h4>What the sources actually confirm</h4></div><small>Tap a fact to see its support</small></div><div className="finder-fact-grid">{analysis.confirmedFacts.map((fact, index) => <details key={`${fact.label}-${index}`}><summary><span>{fact.label}</span><strong>{fact.value}</strong><i className={`confidence-${fact.confidence}`}>{fact.confidence}</i></summary><p>{fact.evidence}</p>{/^https:\/\//.test(fact.sourceUrl) && <a href={fact.sourceUrl} target="_blank" rel="noreferrer">View supporting source</a>}</details>)}</div></section>}
      {analysis.unknowns.length > 0 && <section className="finder-unknowns"><h4><HelpCircle size={18}/> Not verified yet</h4><p>These are unanswered questions, not negative findings.</p><ul>{analysis.unknowns.map((item) => <li key={item}>{item}</li>)}</ul></section>}
      {analysis.sources.length > 0 && <div className="finder-ai-sources"><strong>Sources reviewed</strong>{analysis.sources.map((source) => <a href={source.url} target="_blank" rel="noreferrer" key={source.url}>{source.title}</a>)}</div>}
      <p className="finder-verification-note">AI can miss or misread listing information. Confirm HOA, hazards, permits, condition, and measurements with official documents or your agent before making a decision.</p>
    </div>}
  </section>;
}
