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

export async function analyzeDescription(home: HomeRecord): Promise<AiHomeAnalysis> {
  if (!supabase) throw new Error('AI analysis is not configured yet.');
  const { data, error } = await supabase.functions.invoke<AiHomeAnalysis>('analyze-home', { body: { address: home.address, description: home.listingDescription } });
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
