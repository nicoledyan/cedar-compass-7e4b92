create table if not exists public.listing_research_cache (
  cache_key text primary key,
  address text not null,
  research text not null,
  fetched_at timestamptz not null default now()
);

alter table public.listing_research_cache enable row level security;
revoke all on table public.listing_research_cache from anon, authenticated;

comment on table public.listing_research_cache is 'Private Edge Function cache for public real-estate listing research.';
