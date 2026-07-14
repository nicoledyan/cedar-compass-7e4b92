import { useEffect, useMemo, useState } from 'react';
import { ExternalLink, Flame, Home, Plus, Save, Trash2, X } from 'lucide-react';
import { blankHome, HOME_STORAGE_KEY, scoreHome, validZillowUrl } from './homeFinder';
import type { HomeRecord } from './types';
import './home-finder.css';

function loadHomes(): HomeRecord[] { try { const value = JSON.parse(localStorage.getItem(HOME_STORAGE_KEY) ?? '[]'); return Array.isArray(value) ? value : []; } catch { return []; } }
const numeric = (value: string) => value === '' ? undefined : Number(value);
const ratingLabels = ['Not reviewed', 'Poor', 'Weak', 'Okay', 'Good', 'Excellent'];

export default function HomeFinderPage() {
  const [homes, setHomes] = useState<HomeRecord[]>(loadHomes);
  const [url, setUrl] = useState('');
  const [urlError, setUrlError] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  useEffect(() => { localStorage.setItem(HOME_STORAGE_KEY, JSON.stringify(homes)); }, [homes]);
  const ranked = useMemo(() => [...homes].sort((a, b) => scoreHome(b).overall - scoreHome(a).overall), [homes]);

  const addHome = () => {
    if (!validZillowUrl(url)) { setUrlError('Paste a complete zillow.com listing URL.'); return; }
    if (homes.some((home) => home.zillowUrl.replace(/\/$/, '') === url.trim().replace(/\/$/, ''))) { setUrlError('That Zillow listing is already saved.'); return; }
    const home = blankHome(url);
    setHomes((current) => [home, ...current]); setUrl(''); setUrlError(''); setEditingId(home.id);
  };
  const update = (next: HomeRecord) => setHomes((current) => current.map((home) => home.id === next.id ? { ...next, updatedAt: new Date().toISOString() } : home));
  const remove = (home: HomeRecord) => { if (window.confirm(`Delete ${home.address}? This cannot be undone.`)) { setHomes((current) => current.filter((item) => item.id !== home.id)); if (editingId === home.id) setEditingId(null); } };

  return <main className="finder-page"><div className="finder-shell">
    <header className="finder-hero"><p className="finder-eyebrow">Would I actually enjoy living here?</p><h1>Home Finder</h1><p>Save Zillow candidates, add what you know, and compare them against the life you actually want—not resale theory.</p></header>
    <section className="finder-import"><div><label htmlFor="zillow-url">Zillow listing URL</label><p>The page saves the link locally. Zillow doesn’t provide the listing facts through this import, so you’ll confirm those next.</p></div><div className="finder-import-row"><input id="zillow-url" type="url" value={url} onChange={(event) => { setUrl(event.target.value); setUrlError(''); }} onKeyDown={(event) => { if (event.key === 'Enter') addHome(); }} placeholder="https://www.zillow.com/homedetails/..." /><button type="button" onClick={addHome}><Plus size={18}/> Save home</button></div>{urlError && <p className="finder-error">{urlError}</p>}</section>
    {ranked.length === 0 ? <section className="finder-empty"><Home size={32}/><h2>No homes saved yet</h2><p>Paste your first Zillow listing above. Everything stays in this browser.</p></section> : <section><div className="finder-list-head"><h2>{ranked.length} saved {ranked.length === 1 ? 'home' : 'homes'}</h2><span>Ranked by your current score</span></div><div className="finder-grid">{ranked.map((home) => <HomeCard key={home.id} home={home} editing={editingId === home.id} onEdit={() => setEditingId(editingId === home.id ? null : home.id)} onUpdate={update} onDelete={() => remove(home)} />)}</div></section>}
    <p className="finder-privacy">Records and scores are saved only in this browser. Zillow links remain the live source for listing status and price; imported facts are not automatically verified.</p>
  </div></main>;
}

function HomeCard({ home, editing, onEdit, onUpdate, onDelete }: { home: HomeRecord; editing: boolean; onEdit: () => void; onUpdate: (home: HomeRecord) => void; onDelete: () => void }) {
  const score = scoreHome(home);
  return <article className={`finder-card${score.dealBreakers.length ? ' has-breaker' : ''}`}>
    <div className="finder-card-top"><div className={`finder-score score-${score.overall >= 75 ? 'high' : score.overall >= 60 ? 'mid' : 'low'}`}><strong>{score.overall}</strong><span>overall</span></div><div className="finder-card-title"><h3>{home.address}</h3><a href={home.zillowUrl} target="_blank" rel="noreferrer">Open Zillow <ExternalLink size={14}/></a></div><button className="finder-icon-button" type="button" onClick={onEdit} aria-label={editing ? 'Close details' : 'Edit home'}>{editing ? <X size={19}/> : <span>Edit</span>}</button></div>
    <div className="finder-score-row"><Score label="Lifestyle" value={score.lifestyle}/><Score label="House" value={score.house}/><Score label="Commute" value={score.commute}/><Score label="Risk" value={score.risk}/><Score label="Confidence" value={score.confidence}/></div>
    {score.dealBreakers.length > 0 && <div className="finder-breakers"><Flame size={17}/><div><strong>Needs a hard look</strong>{score.dealBreakers.map((item) => <p key={item}>{item}</p>)}</div></div>}
    {(score.strengths.length > 0 || score.weaknesses.length > 0) && <div className="finder-reasons"><div><strong>Working for it</strong>{score.strengths.map((item) => <p key={item}>+ {item}</p>)}</div><div><strong>Working against it</strong>{score.weaknesses.length ? score.weaknesses.map((item) => <p key={item}>− {item}</p>) : <p>Nothing flagged yet.</p>}</div></div>}
    {editing && <HomeForm home={home} onUpdate={onUpdate} onDelete={onDelete} onDone={onEdit} />}
  </article>;
}

function Score({ label, value }: { label: string; value: number }) { return <div><span>{label}</span><strong>{value}</strong></div>; }

function HomeForm({ home, onUpdate, onDelete, onDone }: { home: HomeRecord; onUpdate: (home: HomeRecord) => void; onDelete: () => void; onDone: () => void }) {
  const [draft, setDraft] = useState(home);
  const set = <K extends keyof HomeRecord>(key: K, value: HomeRecord[K]) => setDraft((current) => ({ ...current, [key]: value }));
  return <form className="finder-form" onSubmit={(event) => { event.preventDefault(); onUpdate(draft); onDone(); }}>
    <fieldset><legend>Listing basics</legend><div className="finder-fields"><TextField label="Address" value={draft.address} onChange={(value) => set('address', value)}/><NumberField label="Price" value={draft.price} onChange={(value) => set('price', value)} prefix="$"/><NumberField label="Bedrooms" value={draft.bedrooms} onChange={(value) => set('bedrooms', value)} step="0.5"/><NumberField label="Bathrooms" value={draft.bathrooms} onChange={(value) => set('bathrooms', value)} step="0.5"/><SelectField label="HOA" value={draft.hoa} onChange={(value) => set('hoa', value as HomeRecord['hoa'])} options={[['unknown','Not confirmed'],['none','No HOA'],['small','Small/minimal'],['restrictive','Restrictive']]}/><SelectField label="Parking" value={draft.parking} onChange={(value) => set('parking', value as HomeRecord['parking'])} options={[['unknown','Not confirmed'],['garage','Garage'],['driveway','Good driveway'],['street','Street only']]}/></div></fieldset>
    <fieldset className="finder-risk-fieldset"><legend>Fire and flood risk</legend><p className="finder-field-note">Use an official risk source when possible. High wildfire risk caps the score and creates a deal-breaker warning.</p><div className="finder-fields"><SelectField label="Wildfire risk" value={draft.wildfireRisk} onChange={(value) => set('wildfireRisk', value as HomeRecord['wildfireRisk'])} options={riskOptions}/><SelectField label="Flood risk" value={draft.floodRisk} onChange={(value) => set('floodRisk', value as HomeRecord['floodRisk'])} options={riskOptions}/></div></fieldset>
    <fieldset><legend>House itself</legend><div className="finder-rating-grid">{([['mountainViews','Mountain views'],['condition','Move-in condition'],['yard','Usable yard'],['naturalLight','Natural light'],['layout','Layout and entertaining']] as const).map(([key,label]) => <RatingField key={key} label={label} value={draft[key]} onChange={(value) => set(key, value)}/>)}</div><div className="finder-checks"><CheckField label="Sunroom" checked={draft.sunroom} onChange={(value) => set('sunroom', value)}/><CheckField label="Screened porch" checked={draft.screenedPorch} onChange={(value) => set('screenedPorch', value)}/><CheckField label="Covered porch" checked={draft.coveredPorch} onChange={(value) => set('coveredPorch', value)}/><CheckField label="Window in shower" checked={draft.showerWindow} onChange={(value) => set('showerWindow', value)}/></div></fieldset>
    <fieldset><legend>Neighborhood and lifestyle</legend><div className="finder-rating-grid">{([['neighborhoodFeel','Established character'],['walkability','Walkability'],['safety','Safety and comfort'],['noise','Quiet / low noise'],['amenities','Useful nearby places']] as const).map(([key,label]) => <RatingField key={key} label={label} value={draft[key]} onChange={(value) => set(key, value)}/>)}</div></fieldset>
    <fieldset><legend>Estimated drive time</legend><div className="finder-fields commute-fields">{([['downtownMinutes','Downtown'],['gardenMinutes','Garden of the Gods'],['blackSheepMinutes','The Black Sheep'],['oldColoradoCityMinutes','Old Colorado City'],['redRockMinutes','Red Rock Canyon'],['manitouMinutes','Manitou Springs']] as const).map(([key,label]) => <NumberField key={key} label={`${label} (min)`} value={draft[key]} onChange={(value) => set(key, value)}/>)}</div></fieldset>
    <fieldset><legend>Notes</legend><textarea value={draft.notes} onChange={(event) => set('notes', event.target.value)} placeholder="What did you notice in the photos, showing, street, or disclosure?" rows={4}/></fieldset>
    <div className="finder-form-actions"><button className="finder-delete" type="button" onClick={onDelete}><Trash2 size={17}/> Delete record</button><button className="finder-save" type="submit"><Save size={17}/> Save assessment</button></div>
  </form>;
}

const riskOptions = [['unknown','Not confirmed'],['low','Low'],['moderate','Moderate'],['high','High'],['very-high','Very high']];
function TextField({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) { return <label><span>{label}</span><input value={value} onChange={(event) => onChange(event.target.value)}/></label>; }
function NumberField({ label, value, onChange, prefix, step = '1' }: { label: string; value?: number; onChange: (value?: number) => void; prefix?: string; step?: string }) { return <label><span>{label}</span><div className={prefix ? 'finder-number-prefix' : ''}>{prefix && <b>{prefix}</b>}<input type="number" min="0" step={step} value={value ?? ''} onChange={(event) => onChange(numeric(event.target.value))}/></div></label>; }
function SelectField({ label, value, onChange, options }: { label: string; value: string; onChange: (value: string) => void; options: string[][] }) { return <label><span>{label}</span><select value={value} onChange={(event) => onChange(event.target.value)}>{options.map(([value,label]) => <option value={value} key={value}>{label}</option>)}</select></label>; }
function RatingField({ label, value, onChange }: { label: string; value: number; onChange: (value: number) => void }) { return <label><span>{label}</span><select value={value} onChange={(event) => onChange(Number(event.target.value))}>{ratingLabels.map((item,index) => <option value={index} key={item}>{index ? `${index} — ${item}` : item}</option>)}</select></label>; }
function CheckField({ label, checked, onChange }: { label: string; checked: boolean; onChange: (value: boolean) => void }) { return <label className="finder-check"><input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)}/><span>{label}</span></label>; }
