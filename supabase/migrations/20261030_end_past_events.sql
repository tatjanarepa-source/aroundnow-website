-- Past events: every night, one-off events and dated camps whose last day has gone get status 'Ended'.
-- Paste into Supabase → SQL Editor → New query → Run. Safe to re-run.
--
-- The app already hides them after their date; this keeps the database tidy too. They are kept, not deleted,
-- so next year's event can be copied from them. Runs inside Supabase (pg_cron, on the Free plan too) at
-- 03:00 UTC, so it doesn't need the laptop.
--
-- To see the runs:  select status, start_time, return_message from cron.job_run_details order by start_time desc limit 10;
-- To run it now:    select public.end_past_events();   (returns how many it ended)
-- To stop it:       select cron.unschedule('end-past-events');

alter table public.listings drop constraint if exists listings_status_check;
alter table public.listings add constraint listings_status_check
  check (status in ('Active', 'Check', 'Pending', 'Flagged', 'Ended', 'Outside London', 'Removed'));

create or replace function public.end_past_events() returns integer
language plpgsql security definer set search_path = public as $$
declare
  n integer;
begin
  update listings
     set status = 'Ended'
   where status in ('Active', 'Check', 'Pending', 'Flagged')
     and coalesce(event_end_date, event_date) < (now() at time zone 'Europe/London')::date;
  get diagnostics n = row_count;
  return n;
end $$;

revoke execute on function public.end_past_events() from public, anon, authenticated;

create extension if not exists pg_cron;
select cron.schedule('end-past-events', '0 3 * * *', 'select public.end_past_events()');

-- Tidy up straight away
select public.end_past_events() as ended_now;
