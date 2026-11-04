-- "Message the tutor" (Tatjana, 3 Nov 2026): private tutors (provider_type = 'individual') show on the map, but never
-- with a phone number, email, home address or personal page. Only tutors with an email on file in listing_contacts
-- show (Tatjana, 4 Nov: otherwise there's no way to pass a message on).
-- Parents who are signed in send a message through the
-- app instead; it's stored here and passed on to the tutor (npm run messages), who replies to the parent's email.
-- Paste into Supabase → SQL Editor → New query → Run. Safe to re-run. Then deploy the app (v51).

-- 1. The messages. Parents can send but never read them back; only the secret key (npm run messages) reads them.
create table if not exists public.contact_messages (
  id          bigint generated always as identity primary key,
  created_at  timestamptz not null default now(),
  listing_id  text not null references public.listings (id) on delete cascade,
  user_id     uuid not null default auth.uid(),
  message     text not null check (char_length(btrim(message)) between 1 and 2000),
  reply_email text not null check (reply_email ~ '^[^@\s]+@[^@\s]+\.[^@\s]+$' and char_length(reply_email) <= 200),
  sent_at     timestamptz   -- when it was passed on to the tutor
);

alter table public.contact_messages enable row level security;

drop policy if exists "Signed-in parents can message tutors" on public.contact_messages;
create policy "Signed-in parents can message tutors" on public.contact_messages
  for insert to authenticated
  with check (
    user_id = auth.uid()
    and exists (select 1 from public.listings l
                where l.id = listing_id and l.provider_type = 'individual' and l.status in ('Active', 'Check'))
    and exists (select 1 from public.listing_contacts lc
                where lc.listing_id = contact_messages.listing_id and lc.contact_details like '%@%')
  );

grant insert on public.contact_messages to authenticated;

-- At most 10 messages per parent per day, so nobody can spam tutors through the app
create or replace function public.contact_messages_limit() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if (select count(*) from public.contact_messages
      where user_id = new.user_id and created_at > now() - interval '1 day') >= 10 then
    raise exception 'daily message limit' using errcode = 'P0001';
  end if;
  return new;
end $$;

drop trigger if exists contact_messages_limit on public.contact_messages;
create trigger contact_messages_limit before insert on public.contact_messages
  for each row execute function public.contact_messages_limit();

-- 2. Tutors show on the map: same list as before, now with individuals too and provider_type in each row.
--    For tutors the personal page (website), street address and postcode are never sent to the app.
create or replace function public.listings_within(p_lat double precision, p_lng double precision, p_km double precision)
returns json
language sql stable security definer
set search_path = public, extensions
as $$
  with here as (select st_setsrid(st_makepoint(p_lng, p_lat), 4326)::geography as pt)
  select coalesce(json_agg(x), '[]'::json) from (
    select
      l.id, l.title, l.provider_name,
      case when l.provider_type = 'individual' then null else l.website end as website,
      l.provider_type, l.delivery_mode, l.location_area,
      st_y(l.location::geometry) as lat, st_x(l.location::geometry) as lng,
      coalesce(l.address_source, '') like 'Approximate%' as approx,
      l.format, l.category, l.subjects, l.age_min_months, l.age_max_months, l.languages, l.runs_when,
      l.holiday_club, l.days_of_week, l.time_of_day, l.start_time, l.end_time,
      l.price_text, l.status, l.created_at, l.last_confirmed_at, l.source,
      l.event_date, l.event_end_date,
      case when l.created_by = auth.uid() then l.created_by end as created_by,
      rep.reason as report_reason, rep.created_at as reported_at
    from public.listings l
    cross join here
    left join lateral (
      select r.reason, r.created_at from public.listing_reports r
      where r.listing_id = l.id and not r.resolved
        and (l.last_confirmed_at is null or r.created_at > l.last_confirmed_at)
      order by r.created_at desc limit 1
    ) rep on true
    where l.status in ('Active', 'Check')
      and (l.provider_type = 'organisation'
           or (l.provider_type = 'individual' and exists (select 1 from public.listing_contacts lc
                                                         where lc.listing_id = l.id and lc.contact_details like '%@%'))
           or (l.created_by is not null and l.created_by = auth.uid()))
      and (l.delivery_mode = 'Online'
          or (l.location is not null
              and st_dwithin(l.location, here.pt, least(greatest(coalesce(p_km, 5), 0.5), 25) * 1000)))
    order by st_distance(l.location, here.pt) nulls first
    -- Only a safety net: the app asks for at most ~11 km (about 1,200 classes on 4 Nov)
    limit 2000
  ) x;
$$;

create or replace function public.listing_details(p_id text)
returns json
language sql stable security definer
set search_path = public
as $$
  select json_build_object('description', l.description, 'schedule_text', l.schedule_text,
                           'address', case when l.provider_type = 'individual' then null else l.address end,
                           'postcode', case when l.provider_type = 'individual' then null else l.postcode end)
  from public.listings l
  where l.id = p_id
    and l.status in ('Active', 'Check')
    and (l.provider_type = 'organisation'
           or (l.provider_type = 'individual' and exists (select 1 from public.listing_contacts lc
                                                         where lc.listing_id = l.id and lc.contact_details like '%@%'))
           or (l.created_by is not null and l.created_by = auth.uid()));
$$;

revoke execute on function public.listings_within(double precision, double precision, double precision) from public;
grant execute on function public.listings_within(double precision, double precision, double precision) to anon, authenticated;
revoke execute on function public.listing_details(text) from public;
grant execute on function public.listing_details(text) to anon, authenticated;
