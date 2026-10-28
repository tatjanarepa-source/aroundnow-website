  -- Make copying the whole database harder, step 1 of 2.
  -- The app now asks only for the classes near the place being looked at (within 20 km, plus online ones),
  -- instead of downloading every listing. Safe to run any time: it adds a function and changes nothing else.
  -- Paste into the Supabase SQL editor and run once. Then deploy the app, then run 20261028_2_lock_listings.sql.

  create or replace function public.listings_near(p_lat double precision, p_lng double precision)
  returns json
  language sql stable security definer
  set search_path = public, extensions
  as $$
    with here as (select st_setsrid(st_makepoint(p_lng, p_lat), 4326)::geography as pt)
    select coalesce(json_agg(x), '[]'::json) from (
      select
        l.id, l.title, l.provider_name, l.website, l.delivery_mode, l.location_area, l.address, l.postcode,
        st_y(l.location::geometry) as lat, st_x(l.location::geometry) as lng, l.address_source,
        l.format, l.category, l.subjects, l.age_min_months, l.age_max_months, l.languages, l.runs_when,
        l.holiday_club, l.days_of_week, l.time_of_day, l.start_time, l.end_time, l.schedule_text,
        l.price_text, l.description, l.status, l.created_at, l.last_confirmed_at, l.source,
        l.event_date, l.event_end_date,
        -- Who added a class stays private; the app only needs to know it was you
        case when l.created_by = auth.uid() then l.created_by end as created_by
      from public.listings l, here
      where l.status in ('Active', 'Check')
        and (l.provider_type = 'organisation' or (l.created_by is not null and l.created_by = auth.uid()))
        and (l.delivery_mode = 'Online'
            or (l.location is not null and st_dwithin(l.location, here.pt, 20000)))
      order by st_distance(l.location, here.pt) nulls first
      limit 500
    ) x;
  $$;

  revoke execute on function public.listings_near(double precision, double precision) from public;
  grant execute on function public.listings_near(double precision, double precision) to anon, authenticated;
