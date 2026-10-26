-- v1 lists organisations only (brief 7.5): clubs, schools, nurseries, venues.
-- Private individuals stay in the database for phase 2 (private tutors +
-- in-app messaging) but the public can't see them.
-- Paste into Supabase → SQL Editor → New query → Run. Safe to re-run.

alter table public.listings
  add column if not exists provider_type text not null default 'organisation'
  check (provider_type in ('organisation', 'individual'));

update public.listings set provider_type = 'individual'
where id in ('R015', 'R020', 'R021', 'R046');

drop policy if exists "Public can read visible listings" on public.listings;
create policy "Public can read visible listings" on public.listings
  for select using (status <> 'Removed' and provider_type = 'organisation');
