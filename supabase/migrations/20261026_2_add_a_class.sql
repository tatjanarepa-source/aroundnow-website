-- "Add a class": signed-in parents add listings; other parents confirm or report them.
-- Run after 20261026_1_organisations_only.sql.
-- Paste into Supabase → SQL Editor → New query → Run. Safe to re-run.
--
-- The rules (agreed 2026-10-26):
--   * A new listing shows straight away as "Not yet confirmed" (status 'Check').
--   * One confirmation from a different signed-in parent makes it 'Active'.
--   * "Something else" (stored as category 'Mixed') waits for an admin ('Pending').
--   * Two reports from different parents hide it until an admin looks ('Flagged').
--   * Going stale (90 days unconfirmed → not yet confirmed, 120 → hidden) and
--     one-off events passing their date are worked out by the website from
--     last_confirmed_at, created_at and event dates, so no scheduled job is needed.
-- Admins work in the Supabase dashboard: Table Editor → listings (status) and
-- listing_reports (reasons; tick resolved when handled).

-- ---------------------------------------------------------------------------
-- Listings: who added it, when it was last confirmed, dates for one-off events
-- ---------------------------------------------------------------------------

-- created_by was a text placeholder for a Firebase user id; sign-in is Supabase Auth
do $$
begin
  if (select data_type from information_schema.columns
      where table_schema = 'public' and table_name = 'listings' and column_name = 'created_by') = 'text' then
    alter table public.listings alter column created_by type uuid using nullif(created_by, '')::uuid;
  end if;
end $$;
alter table public.listings drop constraint if exists listings_created_by_fkey;
alter table public.listings add constraint listings_created_by_fkey
  foreign key (created_by) references auth.users (id) on delete set null;

alter table public.listings add column if not exists last_confirmed_at timestamptz;
alter table public.listings add column if not exists event_date date;      -- one-off events, dated holiday camps
alter table public.listings add column if not exists event_end_date date;

alter table public.listings drop constraint if exists listings_status_check;
alter table public.listings add constraint listings_status_check
  check (status in ('Active', 'Check', 'Pending', 'Flagged', 'Outside London', 'Removed'));

-- The mums' list: what's already Active counts as confirmed from today
update public.listings set last_confirmed_at = now()
where status = 'Active' and last_confirmed_at is null;

-- Everyone sees visible organisations; people also see what they added themselves
drop policy if exists "Public can read visible listings" on public.listings;
create policy "Public can read visible listings" on public.listings
  for select using (
    (status in ('Active', 'Check', 'Outside London') and provider_type = 'organisation')
    or (created_by is not null and created_by = auth.uid())
  );

drop policy if exists "Signed-in users can add listings" on public.listings;
create policy "Signed-in users can add listings" on public.listings
  for insert to authenticated with check (created_by = auth.uid());

grant insert on public.listings to authenticated;

-- Whatever the browser sends, the server decides who added it, its id and its status
create or replace function public.listings_before_insert() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  -- Rows loaded by the import script (secret key) are taken as they are
  if coalesce(auth.jwt() ->> 'role', '') <> 'authenticated' then
    return new;
  end if;

  if (select count(*) from public.listings
      where created_by = auth.uid() and created_at > now() - interval '1 day') >= 10 then
    raise exception 'You can add up to 10 classes a day.';
  end if;
  if coalesce(trim(new.title), '') = '' or coalesce(trim(new.provider_name), '') = '' then
    raise exception 'The class needs a name and who runs it.';
  end if;
  if char_length(new.title) > 120 or char_length(new.provider_name) > 120
     or char_length(coalesce(new.description, '')) > 1000 or char_length(coalesce(new.address, '')) > 200
     or char_length(coalesce(new.website, '')) > 300 or char_length(coalesce(new.price_text, '')) > 80 then
    raise exception 'Some of the details are too long.';
  end if;

  new.id := 'C' || to_char(now(), 'YYMMDD') || substr(md5(random()::text), 1, 5);
  new.created_by := auth.uid();
  new.source := 'Community';
  new.provider_type := 'organisation';
  new.status := case when new.category = 'Mixed' then 'Pending' else 'Check' end;
  new.last_confirmed_at := null;
  new.created_at := now();
  new.updated_at := now();
  new.pros := null;
  new.cons := null;
  new.needs_info := null;
  return new;
end $$;

drop trigger if exists listings_before_insert on public.listings;
create trigger listings_before_insert before insert on public.listings
  for each row execute function public.listings_before_insert();

-- ---------------------------------------------------------------------------
-- Confirmations: "Yes, it's real" from a parent who didn't add it
-- ---------------------------------------------------------------------------
create table if not exists public.listing_confirmations (
  id         uuid primary key default gen_random_uuid(),
  listing_id text not null references public.listings (id) on delete cascade,
  user_id    uuid not null default auth.uid() references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);
create index if not exists listing_confirmations_listing_idx on public.listing_confirmations (listing_id);
alter table public.listing_confirmations enable row level security;

-- Visible, not your own, and you haven't confirmed it in the last 30 days
create or replace function public.can_confirm(p_listing text) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from listings l
                 where l.id = p_listing and l.status in ('Active', 'Check')
                   and l.created_by is distinct from auth.uid())
     and not exists (select 1 from listing_confirmations c
                     where c.listing_id = p_listing and c.user_id = auth.uid()
                       and c.created_at > now() - interval '30 days');
$$;

drop policy if exists "Users see their own confirmations" on public.listing_confirmations;
create policy "Users see their own confirmations" on public.listing_confirmations
  for select to authenticated using (user_id = auth.uid());

drop policy if exists "Users confirm other people's listings" on public.listing_confirmations;
create policy "Users confirm other people's listings" on public.listing_confirmations
  for insert to authenticated with check (user_id = auth.uid() and public.can_confirm(listing_id));

grant select, insert on public.listing_confirmations to authenticated;

create or replace function public.after_confirmation() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  update listings set status = 'Active', last_confirmed_at = now()
  where id = new.listing_id and status in ('Active', 'Check');
  return new;
end $$;

drop trigger if exists after_confirmation on public.listing_confirmations;
create trigger after_confirmation after insert on public.listing_confirmations
  for each row execute function public.after_confirmation();

-- ---------------------------------------------------------------------------
-- Reports: "Something's wrong"
-- ---------------------------------------------------------------------------
create table if not exists public.listing_reports (
  id         uuid primary key default gen_random_uuid(),
  listing_id text not null references public.listings (id) on delete cascade,
  user_id    uuid not null default auth.uid() references auth.users (id) on delete cascade,
  reason     text not null check (reason in ('gone', 'wrong', 'private', 'notkids', 'spam')),
  note       text check (char_length(note) <= 500),
  resolved   boolean not null default false,   -- tick when an admin has dealt with it
  created_at timestamptz not null default now()
);
create index if not exists listing_reports_listing_idx on public.listing_reports (listing_id);
alter table public.listing_reports enable row level security;

-- Visible, and you don't already have an open report on it
create or replace function public.can_report(p_listing text) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from listings l where l.id = p_listing and l.status in ('Active', 'Check'))
     and not exists (select 1 from listing_reports r
                     where r.listing_id = p_listing and r.user_id = auth.uid() and not r.resolved);
$$;

drop policy if exists "Users see their own reports" on public.listing_reports;
create policy "Users see their own reports" on public.listing_reports
  for select to authenticated using (user_id = auth.uid());

drop policy if exists "Users report listings" on public.listing_reports;
create policy "Users report listings" on public.listing_reports
  for insert to authenticated with check (user_id = auth.uid() and public.can_report(listing_id));

grant select, insert on public.listing_reports to authenticated;

-- Two open reports from different people hide the listing until an admin looks
create or replace function public.after_report() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if (select count(distinct user_id) from listing_reports
      where listing_id = new.listing_id and not resolved) >= 2 then
    update listings set status = 'Flagged' where id = new.listing_id and status in ('Active', 'Check');
  end if;
  return new;
end $$;

drop trigger if exists after_report on public.listing_reports;
create trigger after_report after insert on public.listing_reports
  for each row execute function public.after_report();

-- Helper functions are only for the policies and triggers above
revoke execute on function public.can_confirm(text) from public, anon;
revoke execute on function public.can_report(text) from public, anon;
grant execute on function public.can_confirm(text) to authenticated;
grant execute on function public.can_report(text) to authenticated;
