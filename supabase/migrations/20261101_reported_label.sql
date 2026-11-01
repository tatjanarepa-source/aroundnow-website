  -- "Reported" label (agreed 1 Nov 2026).
  -- The first report on a class no longer stays invisible: the class shows "Reported: …?" and other parents are
  -- asked whether it's right. "Yes, I agree" is a second report (two hide the class until an admin looks, as before);
  -- "it's fine" is a confirmation, which takes the label away and resets the count.
  -- Only the reason and the date are shown, never the reporter or their note.
  -- Paste into Supabase → SQL Editor → New query → Run. Safe to re-run. Then deploy the app (v30).

  -- Reports since the class was last confirmed are the ones that count
  create or replace function public.after_report() returns trigger
  language plpgsql security definer set search_path = public as $$
  begin
    if (select count(distinct r.user_id) from listing_reports r, listings l
        where r.listing_id = new.listing_id and l.id = r.listing_id and not r.resolved
          and (l.last_confirmed_at is null or r.created_at > l.last_confirmed_at)) >= 2 then
      update listings set status = 'Flagged' where id = new.listing_id and status in ('Active', 'Check');
    end if;
    return new;
  end $$;

  -- Same as before, plus report_reason and reported_at (the newest open report since the last confirmation)
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
            or (l.location is not null and st_dwithin(l.location, here.pt, 20000)))
      order by st_distance(l.location, here.pt) nulls first
      limit 500
    ) x;
  $$;

  revoke execute on function public.listings_near(double precision, double precision) from public;
  grant execute on function public.listings_near(double precision, double precision) to anon, authenticated;
