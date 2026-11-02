  -- Load only what the app needs (agreed 2 Nov 2026).
  -- Before: listings_near sent the nearest 500 classes within 20 km, with full descriptions, on every app start
  -- (about 98 KB from Ealing Broadway, and the 500 limit had started cutting off classes 12 km away).
  -- Now: listings_within sends the classes within the distance the app asks for (the chosen circle plus the next
  -- one, for the "more within 3 mi" line), without the text only the details page shows (description, schedule
  -- note, street address). listing_details sends that text for one class when it's opened.
  -- listings_near stays as it was: phones still running an older app version use it until they update.
  -- Paste into Supabase → SQL Editor → New query → Run. Safe to re-run. Then deploy the app (v40).

  create or replace function public.listings_within(p_lat double precision, p_lng double precision, p_km double precision)
  returns json
  language sql stable security definer
  set search_path = public, extensions
  as $$
    with here as (select st_setsrid(st_makepoint(p_lng, p_lat), 4326)::geography as pt)
    select coalesce(json_agg(x), '[]'::json) from (
      select
        l.id, l.title, l.provider_name, l.website, l.delivery_mode, l.location_area,
        st_y(l.location::geometry) as lat, st_x(l.location::geometry) as lng,
        coalesce(l.address_source, '') like 'Approximate%' as approx,
        l.format, l.category, l.subjects, l.age_min_months, l.age_max_months, l.languages, l.runs_when,
        l.holiday_club, l.days_of_week, l.time_of_day, l.start_time, l.end_time,
        l.price_text, l.status, l.created_at, l.last_confirmed_at, l.source,
        l.event_date, l.event_end_date,
        -- Who added a class stays private; the app only needs to know it was you
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
        and (l.provider_type = 'organisation' or (l.created_by is not null and l.created_by = auth.uid()))
        and (l.delivery_mode = 'Online'
            or (l.location is not null
                and st_dwithin(l.location, here.pt, least(greatest(coalesce(p_km, 5), 0.5), 25) * 1000)))
      order by st_distance(l.location, here.pt) nulls first
      -- Only a safety net for very busy areas: the distance does the real limiting
      limit 2000
    ) x;
  $$;

  -- The details page's text for one class (same visibility rules as the list)
  create or replace function public.listing_details(p_id text)
  returns json
  language sql stable security definer
  set search_path = public
  as $$
    select json_build_object('description', l.description, 'schedule_text', l.schedule_text,
                             'address', l.address, 'postcode', l.postcode)
    from public.listings l
    where l.id = p_id
      and l.status in ('Active', 'Check')
      and (l.provider_type = 'organisation' or (l.created_by is not null and l.created_by = auth.uid()));
  $$;

  revoke execute on function public.listings_within(double precision, double precision, double precision) from public;
  grant execute on function public.listings_within(double precision, double precision, double precision) to anon, authenticated;
  revoke execute on function public.listing_details(text) from public;
  grant execute on function public.listing_details(text) to anon, authenticated;
