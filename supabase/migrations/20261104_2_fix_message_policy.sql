-- Fix for "Message the tutor" (4 Nov 2026): sending failed with "new row violates row-level security policy".
-- The rule checked the tutor's listing and private email, but parents aren't allowed to read either table, so the
-- check always said no. Now one small function does the check with admin rights and only answers yes or no.
-- Paste into Supabase → SQL Editor → New query → Run. Safe to re-run.

create or replace function public.can_message_tutor(p_id text)
returns boolean
language sql stable security definer
set search_path = public
as $$
  select exists (
    select 1 from public.listings l
    join public.listing_contacts lc on lc.listing_id = l.id
    where l.id = p_id and l.provider_type = 'individual' and l.status in ('Active', 'Check')
      and lc.contact_details like '%@%'
  );
$$;

revoke execute on function public.can_message_tutor(text) from public;
grant execute on function public.can_message_tutor(text) to authenticated;

drop policy if exists "Signed-in parents can message tutors" on public.contact_messages;
create policy "Signed-in parents can message tutors" on public.contact_messages
  for insert to authenticated
  with check (user_id = auth.uid() and public.can_message_tutor(listing_id));
