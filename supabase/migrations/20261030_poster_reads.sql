-- "Fill in from a photo": limits on how often a poster photo can be sent to Claude, so misuse can't run up the bill.
-- Paste into Supabase → SQL Editor → New query → Run. Safe to re-run. Run it BEFORE deploying the app v25.
--
-- The Worker (worker/index.js) calls start_poster_read() with the parent's own sign-in token before every photo:
--   'ok'            - go ahead (the read is counted)
--   'user_limit'    - this parent has sent 10 photos in the last 24 hours
--   'global_limit'  - everyone together has sent 200 in the last 24 hours (raise it here if real use needs more)
-- Anyone not signed in can't call it at all.
-- To see use: select date(created_at), count(*), count(distinct user_id) from poster_reads group by 1 order by 1 desc;

create table if not exists public.poster_reads (
  id         bigserial primary key,
  user_id    uuid not null references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);
create index if not exists poster_reads_user_idx on public.poster_reads (user_id, created_at);
create index if not exists poster_reads_time_idx on public.poster_reads (created_at);
alter table public.poster_reads enable row level security;
-- No policies: nobody reads or writes the table directly, only through the function below

create or replace function public.start_poster_read() returns text
language plpgsql security definer set search_path = public as $$
begin
  if auth.uid() is null then
    raise exception 'Sign in first.' using errcode = '42501';
  end if;
  if (select count(*) from poster_reads
      where user_id = auth.uid() and created_at > now() - interval '1 day') >= 10 then
    return 'user_limit';
  end if;
  if (select count(*) from poster_reads where created_at > now() - interval '1 day') >= 200 then
    return 'global_limit';
  end if;
  insert into poster_reads (user_id) values (auth.uid());
  return 'ok';
end $$;

revoke execute on function public.start_poster_read() from public, anon;
grant execute on function public.start_poster_read() to authenticated;
