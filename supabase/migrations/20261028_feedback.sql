-- Feedback from testers and parents: "Something not right? Tell us" at the end of the list.
-- Anyone can send; nobody can read it through the app (read with `npm run feedback`, which uses the secret key).
-- Paste into the Supabase SQL editor and run once.

create table if not exists public.feedback (
  id         bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  user_id    uuid default auth.uid(),
  message    text not null check (char_length(message) between 1 and 2000),
  contact    text check (contact is null or char_length(contact) <= 200),
  context    jsonb  -- filters, rough area, screen size, app version; only if the sender ticked the box
);

alter table public.feedback enable row level security;

drop policy if exists "Anyone can send feedback" on public.feedback;
create policy "Anyone can send feedback" on public.feedback
  for insert to anon, authenticated with check (true);

grant insert on public.feedback to anon, authenticated;
