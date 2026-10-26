-- AroundNow listings database.
-- Paste this whole file into Supabase → SQL Editor → New query → Run.
-- Safe to re-run: it only creates things that don't exist yet.
-- Later changes live in supabase/migrations/: run those after this, oldest first.

create extension if not exists postgis;

-- ---------------------------------------------------------------------------
-- Listings: one row per activity per venue (a provider with 3 venues = 3 rows)
-- ---------------------------------------------------------------------------
create table if not exists public.listings (
  id              text primary key,              -- e.g. R033, or generated for new listings
  title           text not null,
  provider_name   text,
  website         text,                          -- official page (brief 7.2: strongly recommended)
  contact_method  text,                          -- Website / Email / Phone / WhatsApp / Facebook / ...
  delivery_mode   text check (delivery_mode in ('In-person', 'Online', 'Hybrid')),
  location_area   text,                          -- human-readable area, e.g. "Ealing"
  address         text,
  postcode        text,
  location        geography(Point, 4326),        -- map pin; null for online / unknown venue
  address_source  text,                          -- where the address came from

  format          text check (format in (
                    'Weekend school', 'After-school class', 'Group class', 'Preschool / nursery',
                    'Holiday camp', 'Workshop / event', 'Online course')),
  category        text check (category in (
                    'Languages', 'Arts / Crafts', 'Performing arts', 'Sports / Dance', 'Chess',
                    'STEM / Thinking', 'Childcare / Preschool', 'Outdoor / Nature',
                    'Events / Parties', 'Life skills', 'Mixed')),
  subjects        text[] not null default '{}',
  age_min_months  int check (age_min_months >= 0),
  age_max_months  int check (age_max_months >= 0),
  languages       text[] not null default '{}',
  runs_when       text check (runs_when in ('Term time', 'Holidays', 'Both', 'Year-round')),
  holiday_club    boolean,
  days_of_week    text[] not null default '{}'
                    check (days_of_week <@ array['Mon','Tue','Wed','Thu','Fri','Sat','Sun']),
  time_of_day     text[] not null default '{}'
                    check (time_of_day <@ array['Morning','Afternoon','Evening']),
  start_time      time,
  end_time        time,
  schedule_text   text,
  price_text      text,
  description     text,
  pros            text,
  cons            text,

  status          text not null default 'Check'
                    check (status in ('Active', 'Check', 'Outside London', 'Removed')),
  needs_info      text,
  source          text,                          -- e.g. "Mums' list", "Community"
  created_by      text,                          -- Firebase user id once sign-in exists
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),

  check (age_max_months is null or age_min_months is null or age_max_months >= age_min_months)
);

create index if not exists listings_location_idx on public.listings using gist (location);
create index if not exists listings_category_idx on public.listings (category);

-- Personal contact details (names, phone numbers, emails) are kept apart from
-- the public listing. No public access at all — only admins via the dashboard.
create table if not exists public.listing_contacts (
  listing_id      text primary key references public.listings (id) on delete cascade,
  contact_details text not null
);

-- Keep updated_at fresh
create or replace function public.touch_updated_at() returns trigger
language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

drop trigger if exists listings_touch on public.listings;
create trigger listings_touch before update on public.listings
  for each row execute function public.touch_updated_at();

-- ---------------------------------------------------------------------------
-- Security: anyone can read visible listings; nobody can write from the
-- browser yet (writes come with sign-in). Contacts are never public.
-- ---------------------------------------------------------------------------
alter table public.listings enable row level security;
alter table public.listing_contacts enable row level security;

drop policy if exists "Public can read visible listings" on public.listings;
create policy "Public can read visible listings" on public.listings
  for select using (status <> 'Removed');

-- ---------------------------------------------------------------------------
-- Search used by the website: radius + age + filters in one query.
-- Call it from the browser as POST /rest/v1/rpc/search_listings
-- ---------------------------------------------------------------------------
create or replace function public.search_listings(
  p_lat            double precision,
  p_lng            double precision,
  p_radius_km      double precision default 5,
  p_age_months     int     default null,   -- child's age; null = any age
  p_categories     text[]  default null,
  p_formats        text[]  default null,
  p_days           text[]  default null,   -- matches if it runs on ANY of these days
  p_times          text[]  default null,
  p_languages      text[]  default null,
  p_runs_when      text[]  default null,
  p_q              text    default null,   -- free-text search
  p_include_online boolean default true    -- online listings have no pin but still match
)
returns table (
  id text, title text, provider_name text, website text, delivery_mode text,
  location_area text, address text, postcode text, lat double precision, lng double precision,
  format text, category text, subjects text[], age_min_months int, age_max_months int,
  languages text[], runs_when text, holiday_club boolean, days_of_week text[], time_of_day text[],
  start_time time, end_time time, schedule_text text, price_text text, description text,
  pros text, cons text, status text, distance_km double precision
)
language sql stable
set search_path = public, extensions
as $$
  with here as (select st_setsrid(st_makepoint(p_lng, p_lat), 4326)::geography as pt)
  select
    l.id, l.title, l.provider_name, l.website, l.delivery_mode,
    l.location_area, l.address, l.postcode,
    st_y(l.location::geometry), st_x(l.location::geometry),
    l.format, l.category, l.subjects, l.age_min_months, l.age_max_months,
    l.languages, l.runs_when, l.holiday_club, l.days_of_week, l.time_of_day,
    l.start_time, l.end_time, l.schedule_text, l.price_text, l.description,
    l.pros, l.cons, l.status,
    round((st_distance(l.location, here.pt) / 1000)::numeric, 1)::double precision
  from public.listings l, here
  where l.status in ('Active', 'Check')
    and (
      (l.location is not null and st_dwithin(l.location, here.pt, p_radius_km * 1000))
      or (p_include_online and l.delivery_mode = 'Online')
    )
    and (p_age_months is null or (
          coalesce(l.age_min_months, 0) <= p_age_months
          and coalesce(l.age_max_months, 1000) >= p_age_months))
    and (p_categories is null or l.category  = any (p_categories))
    and (p_formats    is null or l.format    = any (p_formats))
    and (p_runs_when  is null or l.runs_when = any (p_runs_when))
    and (p_days       is null or l.days_of_week && p_days)
    and (p_times      is null or l.time_of_day  && p_times)
    and (p_languages  is null or l.languages    && p_languages)
    and (p_q is null or p_q = '' or
         concat_ws(' ', l.title, l.provider_name, l.description, l.location_area,
                   array_to_string(l.subjects, ' ')) ilike '%' || p_q || '%')
  order by st_distance(l.location, here.pt) nulls last, l.title;
$$;

grant execute on function public.search_listings to anon, authenticated;
