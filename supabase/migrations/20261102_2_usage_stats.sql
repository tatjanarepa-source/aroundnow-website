  -- Simple, privacy-friendly usage counts for Tatjana's statistics (agreed 2 Nov 2026).
  -- The app adds one row when it opens, when a different area is searched, and when a class is opened.
  -- Stored: a random device number made by the app (no name, email or IP), the area as the app names it
  -- ("Ealing Broadway"; "Near me" only as a point rounded to about 1 km), distance, ages picked, and the class id.
  -- Anyone can add rows; nobody can read them with the public key. `npm run stats` reads them with the secret key.
  -- Paste into Supabase → SQL Editor → New query → Run. Safe to re-run. Then deploy the app (v42).

  create table if not exists public.usage_events (
    id bigint generated always as identity primary key,
    created_at timestamptz not null default now(),
    device text not null check (char_length(device) between 8 and 40),
    kind text not null check (kind in ('open', 'search', 'detail')),
    area text check (char_length(area) <= 80),
    lat double precision,
    lng double precision,
    radius_km real,
    ages smallint[],
    listing_id text check (char_length(listing_id) <= 40),
    app text check (char_length(app) <= 10)
  );
  create index if not exists usage_events_created_at on public.usage_events (created_at);

  alter table public.usage_events enable row level security;
  drop policy if exists "anyone can add usage" on public.usage_events;
  create policy "anyone can add usage" on public.usage_events for insert to anon, authenticated with check (true);
  -- No select policy: rows can't be read back from the app

  grant insert on public.usage_events to anon, authenticated;

  -- Keep a year of rows, nothing older (runs with the nightly jobs if pg_cron is on; harmless otherwise)
  do $$
  begin
    if exists (select 1 from pg_extension where extname = 'pg_cron') then
      perform cron.unschedule(jobid) from cron.job where jobname = 'usage-events-cleanup';
      perform cron.schedule('usage-events-cleanup', '17 3 * * *',
        $job$delete from public.usage_events where created_at < now() - interval '365 days'$job$);
    end if;
  end $$;
