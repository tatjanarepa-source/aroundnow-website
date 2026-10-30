-- Duplicates: stop the same class going on the map twice, and let parents report one that did.
-- Paste into Supabase → SQL Editor → New query → Run. Safe to re-run.
-- Run it BEFORE deploying the app v24 (its "It's listed twice" report reason needs it).
--
-- The rules (agreed 2026-10-30):
--   * The app first shows classes near the postcode that look the same ("Is it one of these?"), and
--     "Yes, that's it" confirms the existing class instead of adding a copy.
--   * Here, as a safety net: the same parent adding the same class again (same name, same postcode) is refused.
--   * A new class that looks like one already listed (close by or the same website, and a similar name)
--     is still added, but waits for an admin as 'Pending', with duplicate_of saying which class it may copy.
--     The admin either sets it to 'Check' (it's different) or 'Removed' (it's a copy).
--   * Classes added by the import script (secret key) are not checked here; npm run check:batch warns about those.
--
-- To review: Table Editor → listings, filter duplicate_of "is not null" and status = Pending. Or run:
--   select n.id, n.title, n.provider_name, n.postcode, n.duplicate_of, o.title as looks_like, o.provider_name as looks_like_by
--   from listings n join listings o on o.id = n.duplicate_of where n.status = 'Pending';

create extension if not exists pg_trgm with schema extensions;

alter table public.listings add column if not exists duplicate_of text references public.listings (id) on delete set null;

-- What a website says about who runs a class: its host name, or the page name on social sites.
-- Sites many organisers share (Eventbrite, Happity, Google forms…) say nothing, so they give null.
-- Matches siteKey() in app.js.
create or replace function public.site_key(u text) returns text
language sql immutable set search_path = public as $$
  with p as (
    select lower(regexp_replace(coalesce(u, ''), '^\s*(https?://)?(www\.)?', '', 'i')) as rest
  ), h as (
    select split_part(split_part(split_part(rest, '/', 1), '?', 1), '#', 1) as host,
           split_part(split_part(split_part(rest, '/', 2), '?', 1), '#', 1) as page
    from p
  )
  select case
    when host not like '%.%' then null
    when host in ('eventbrite.co.uk', 'eventbrite.com', 'happity.co.uk', 'tickettailor.com', 'buytickets.at',
                  'google.com', 'docs.google.com', 'forms.gle', 'goo.gl', 'maps.app.goo.gl') then null
    when host in ('instagram.com', 'facebook.com', 'm.facebook.com', 'linktr.ee', 'tiktok.com') then
      case when page = '' then null else host || '/' || page end
    else host
  end
  from h;
$$;

-- Whatever the browser sends, the server decides who added it, its id and its status
-- (as in 20261026_2_add_a_class.sql, plus the two duplicate checks)
create or replace function public.listings_before_insert() returns trigger
language plpgsql security definer set search_path = public, extensions as $$
declare
  new_site text;
  new_name text;
  dup text;
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

  -- The same parent adding the same class again (a double tap, or forgetting they'd added it)
  if exists (select 1 from public.listings l
             where l.created_by = auth.uid() and l.status <> 'Removed'
               and lower(trim(l.title)) = lower(trim(new.title))
               and coalesce(upper(replace(l.postcode, ' ', '')), '') = coalesce(upper(replace(new.postcode, ' ', '')), '')) then
    raise exception 'You’ve already added this class.';
  end if;

  -- Looks like a class already on the map: within 300 m (or both online) with a similar name,
  -- or the same website with a similar name anywhere
  new_site := site_key(new.website);
  new_name := lower(new.title || ' ' || new.provider_name);
  select l.id into dup
  from public.listings l
  where l.status in ('Active', 'Check', 'Pending', 'Flagged')
    and (
      ((   (new.location is not null and l.location is not null and st_dwithin(l.location, new.location, 300))
        or (new.location is null and l.location is null))
       and (similarity(lower(l.title || ' ' || coalesce(l.provider_name, '')), new_name) >= 0.45
            or (new_site is not null and site_key(l.website) = new_site
                and similarity(lower(l.title || ' ' || coalesce(l.provider_name, '')), new_name) >= 0.25)))
      or (new_site is not null and site_key(l.website) = new_site
          and similarity(lower(l.title || ' ' || coalesce(l.provider_name, '')), new_name) >= 0.6)
    )
  order by similarity(lower(l.title || ' ' || coalesce(l.provider_name, '')), new_name) desc
  limit 1;

  new.id := 'C' || to_char(now(), 'YYMMDD') || substr(md5(random()::text), 1, 5);
  new.created_by := auth.uid();
  new.source := 'Community';
  new.provider_type := 'organisation';
  new.status := case when new.category = 'Mixed' or dup is not null then 'Pending' else 'Check' end;
  new.duplicate_of := dup;
  new.last_confirmed_at := null;
  new.created_at := now();
  new.updated_at := now();
  new.pros := null;
  new.cons := null;
  new.needs_info := case when dup is not null then 'Possible duplicate of ' || dup end;
  return new;
end $$;

drop trigger if exists listings_before_insert on public.listings;
create trigger listings_before_insert before insert on public.listings
  for each row execute function public.listings_before_insert();

-- "It's listed twice" as a report reason (two reports hide a class until an admin looks, as before)
alter table public.listing_reports drop constraint if exists listing_reports_reason_check;
alter table public.listing_reports add constraint listing_reports_reason_check
  check (reason in ('gone', 'wrong', 'duplicate', 'private', 'notkids', 'spam'));
