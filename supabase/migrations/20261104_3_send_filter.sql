-- "Special needs friendly" filter (Tatjana, 4 Nov 2026): classes made for children with special needs (SEND), or with
-- SEND sessions (inclusive swims, SEND soft play and stay and play, babyballet Shine, Tiny Senses, relaxed sessions).
-- Adds a yes/no field, marks the 31 classes found on 4 Nov, and sends the field to the app.
-- Paste into Supabase → SQL Editor → New query → Run. Safe to re-run. Then deploy the app (v53).

alter table public.listings add column if not exists send boolean not null default false;

update public.listings set send = true where id in (
  'W261027-111',
  'W261027-114',
  'W261027-117',
  'W261030-13',
  'W261031-09',
  'W261031-135',
  'W261031-164',
  'W261031-252',
  'W261031-253',
  'W261031-257',
  'W261031-258',
  'W261031-259',
  'W261031-261',
  'W261031-265',
  'W261031-266',
  'W261031-268',
  'W261031-274',
  'W261031-277',
  'W261031-278',
  'W261031-279',
  'W261031-282',
  'W261031-299',
  'W261031-52',
  'W261102-2381',
  'W261103-426',
  'W261103-466',
  'W261103-557',
  'W261103-720',
  'W261103-728',
  'W261103-733',
  'W261104-01'
);

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
      l.provider_type, l.send, l.delivery_mode, l.location_area,
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

revoke execute on function public.listings_within(double precision, double precision, double precision) from public;
grant execute on function public.listings_within(double precision, double precision, double precision) to anon, authenticated;
