import { createClient, type Session } from '@supabase/supabase-js';
import type { HomeRecord } from './types';

const supabaseUrl = 'https://haszigthrkwswwdvqkrx.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined;

export const aiConfigured = Boolean(supabaseKey);
export const supabase = supabaseKey ? createClient(supabaseUrl, supabaseKey, { auth: { flowType: 'pkce', detectSessionInUrl: true, persistSession: true } }) : null;

export type RatingKey = 'mountainViews' | 'condition' | 'yard' | 'naturalLight' | 'layout' | 'neighborhoodFeel' | 'walkability' | 'safety' | 'noise' | 'amenities';

export interface AiSuggestion {
  field: RatingKey;
  rating: number;
  evidence: string;
  confidence: 'low' | 'medium' | 'high';
}

export interface AiHomeAnalysis {
  summary: string;
  observations: string[];
  cautions: string[];
  suggestions: AiSuggestion[];
  facts: {
    price: number | null; bedrooms: number | null; bathrooms: number | null;
    hoa: HomeRecord['hoa'] | null; parking: HomeRecord['parking'] | null;
    sunroom: boolean | null; screenedPorch: boolean | null; coveredPorch: boolean | null; showerWindow: boolean | null;
  };
}

export interface ListingPhoto {
  name: string;
  dataUrl: string;
}

export async function getSession(): Promise<Session | null> {
  if (!supabase) return null;
  return (await supabase.auth.getSession()).data.session;
}

export async function sendSignInLink(email: string) {
  if (!supabase) throw new Error('AI analysis is not configured yet.');
  const { error } = await supabase.auth.signInWithOtp({ email, options: { emailRedirectTo: `${window.location.origin}${import.meta.env.BASE_URL}` } });
  if (error) throw error;
}

export async function signOut() { await supabase?.auth.signOut(); }

export async function prepareListingPhotos(files: FileList | File[]): Promise<ListingPhoto[]> {
  const selected = Array.from(files).filter((file) => file.type.startsWith('image/')).slice(0, 5);
  return Promise.all(selected.map(async (file) => {
    const source = await createImageBitmap(file);
    const scale = Math.min(1, 1400 / Math.max(source.width, source.height));
    const canvas = document.createElement('canvas');
    canvas.width = Math.max(1, Math.round(source.width * scale));
    canvas.height = Math.max(1, Math.round(source.height * scale));
    canvas.getContext('2d')?.drawImage(source, 0, 0, canvas.width, canvas.height);
    source.close();
    return { name: file.name, dataUrl: canvas.toDataURL('image/jpeg', .72) };
  }));
}

export async function analyzeListing(home: HomeRecord, photos: ListingPhoto[] = []): Promise<AiHomeAnalysis> {
  if (!supabase) throw new Error('AI analysis is not configured yet.');
  const { data, error } = await supabase.functions.invoke<AiHomeAnalysis>('analyze-home', { body: { address: home.address, listingUrl: home.zillowUrl, description: home.listingDescription, photos: photos.map((photo) => photo.dataUrl) } });
  if (error) {
    const context = 'context' in error ? error.context : null;
    if (context instanceof Response) {
      const detail = await context.clone().json().catch(() => null) as { error?: string } | null;
      if (detail?.error) throw new Error(detail.error);
    }
    throw new Error(error.message || 'The listing could not be analyzed.');
  }
  if (!data) throw new Error('Groq returned an empty analysis.');
  return data;
}
