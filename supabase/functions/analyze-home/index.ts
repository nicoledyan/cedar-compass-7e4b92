const allowedOrigins = new Set([
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'https://nicoledyan.github.io',
]);

const ratingFields = ['mountainViews', 'condition', 'yard', 'naturalLight', 'layout', 'neighborhoodFeel', 'walkability', 'safety', 'noise', 'amenities'] as const;
const schema = {
  type: 'object', additionalProperties: false,
  properties: {
    summary: { type: 'string' },
    observations: { type: 'array', items: { type: 'string' } },
    cautions: { type: 'array', items: { type: 'string' } },
    suggestions: { type: 'array', items: { type: 'object', additionalProperties: false, properties: {
      field: { type: 'string', enum: ratingFields }, rating: { type: 'integer', minimum: 1, maximum: 5 }, evidence: { type: 'string' }, confidence: { type: 'string', enum: ['low', 'medium', 'high'] },
    }, required: ['field', 'rating', 'evidence', 'confidence'] } },
  }, required: ['summary', 'observations', 'cautions', 'suggestions'],
};

function cors(origin: string | null) {
  const allowed = origin && allowedOrigins.has(origin) ? origin : 'https://nicoledyan.github.io';
  return { 'Access-Control-Allow-Origin': allowed, 'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type', 'Access-Control-Allow-Methods': 'POST, OPTIONS', 'Vary': 'Origin' };
}

Deno.serve(async (request) => {
  const origin = request.headers.get('origin');
  const headers = { ...cors(origin), 'Content-Type': 'application/json' };
  if (request.method === 'OPTIONS') return new Response('ok', { headers });
  if (request.method !== 'POST' || !origin || !allowedOrigins.has(origin)) return new Response(JSON.stringify({ error: 'Not allowed.' }), { status: 403, headers });

  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const publishableKeys = JSON.parse(Deno.env.get('SUPABASE_PUBLISHABLE_KEYS') ?? '{}');
  const publishableKey = Object.values(publishableKeys)[0] as string | undefined ?? Deno.env.get('SUPABASE_ANON_KEY');
  const authResponse = await fetch(`${supabaseUrl}/auth/v1/user`, { headers: { Authorization: request.headers.get('Authorization') ?? '', apikey: publishableKey ?? '' } });
  if (!authResponse.ok) return new Response(JSON.stringify({ error: 'Sign in to use AI analysis.' }), { status: 401, headers });
  const user = await authResponse.json();
  const allowedEmail = Deno.env.get('ALLOWED_EMAIL')?.toLowerCase();
  if (!allowedEmail || user.email?.toLowerCase() !== allowedEmail) return new Response(JSON.stringify({ error: 'This account is not approved for AI analysis.' }), { status: 403, headers });

  let body: { address?: string; description?: string };
  try { body = await request.json(); } catch { return new Response(JSON.stringify({ error: 'Invalid request.' }), { status: 400, headers }); }
  const description = body.description?.trim() ?? '';
  if (description.length < 40 || description.length > 18000) return new Response(JSON.stringify({ error: 'The listing description must be between 40 and 18,000 characters.' }), { status: 400, headers });

  const groqKey = Deno.env.get('GROQ_API_KEY');
  if (!groqKey) return new Response(JSON.stringify({ error: 'Groq is not configured.' }), { status: 503, headers });
  const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST', headers: { Authorization: `Bearer ${groqKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'openai/gpt-oss-20b', temperature: 0.1, max_completion_tokens: 1600,
      response_format: { type: 'json_schema', json_schema: { name: 'home_listing_analysis', strict: true, schema } },
      messages: [
        { role: 'system', content: `Analyze only explicit evidence in a real-estate listing description for one person's lifestyle fit. Never infer wildfire or flood risk, crime/safety, commute times, structural condition, legal facts, or neighborhood walkability without explicit evidence. Treat marketing claims as unverified. Suggest a 1-5 rating only when the description contains direct evidence. For noise, 5 means very quiet. For condition, cosmetic marketing alone is low confidence. Put unverifiable or missing important facts in cautions. Keep evidence short and quote or closely paraphrase the description.` },
        { role: 'user', content: `Address label: ${body.address ?? 'Not confirmed'}\n\nListing description:\n${description}` },
      ],
    }),
  });
  if (!groqResponse.ok) {
    const detail = await groqResponse.text();
    console.error('Groq error', groqResponse.status, detail.slice(0, 500));
    return new Response(JSON.stringify({ error: 'Groq could not analyze this listing right now.' }), { status: 502, headers });
  }
  const completion = await groqResponse.json();
  try {
    const analysis = JSON.parse(completion.choices?.[0]?.message?.content ?? '');
    return new Response(JSON.stringify(analysis), { headers });
  } catch { return new Response(JSON.stringify({ error: 'Groq returned an unexpected response.' }), { status: 502, headers }); }
});
