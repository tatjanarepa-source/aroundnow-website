  -- Parents edit classes themselves (agreed 2 Nov 2026: "driven by the people").
  -- Any signed-in parent can change a visible class. The change shows at once, and the class goes back to
  -- "Not yet confirmed" until ANOTHER parent confirms it (the editor can't confirm their own edit).
  -- Every edit is kept in listing_edits with the old and new values, so a bad edit can be undone
  -- (`npm run edits`, `npm run edits -- undo <id>`). Limit: 20 edits per person per day.
  -- Paste into Supabase → SQL Editor → New query → Run. Safe to re-run. Then deploy the app (v43).

  create table if not exists public.listing_edits (
    id bigint generated always as identity primary key,
    listing_id text not null references public.listings (id) on delete cascade,
    user_id uuid not null references auth.users (id) on delete cascade,
    created_at timestamptz not null default now(),
    before jsonb not null,
    after jsonb not null,
    undone boolean not null default false
  );
  create index if not exists listing_edits_listing_idx on public.listing_edits (listing_id);
  create index if not exists listing_edits_user_idx on public.listing_edits (user_id, created_at);
  alter table public.listing_edits enable row level security;
  -- No policies: only edit_listing (below) writes here, and only the secret key reads it

  create or replace function public.edit_listing(p_id text, p_fields jsonb)
  returns text
  language plpgsql security definer
  set search_path = public, extensions
  as $$
  declare
    me uuid := auth.uid();
    cols text[] := array['title', 'provider_name', 'website', 'delivery_mode', 'location_area', 'address', 'postcode',
      'address_source', 'format', 'category', 'age_min_months', 'age_max_months', 'languages', 'runs_when',
      'days_of_week', 'time_of_day', 'start_time', 'end_time', 'event_date', 'event_end_date', 'schedule_text',
      'price_text', 'description'];
    old_row jsonb;
    old_vals jsonb;
    new_vals jsonb;
  begin
    if me is null then raise exception 'Please sign in to edit a class'; end if;
    select to_jsonb(l) || jsonb_build_object('location', st_asewkt(l.location::geometry)) into old_row
      from listings l
      where l.id = p_id and l.status in ('Active', 'Check')
        and (l.provider_type = 'organisation' or l.created_by = me);
    if old_row is null then raise exception 'This class can''t be edited'; end if;
    if (select count(*) from listing_edits e where e.user_id = me and e.created_at > now() - interval '1 day') >= 20 then
      raise exception 'That''s 20 edits today. Please try again tomorrow';
    end if;
    if coalesce(trim(p_fields->>'title'), '') = '' then raise exception 'The class needs a name'; end if;

    -- Only these columns, and only the ones sent
    select coalesce(jsonb_object_agg(k, old_row->k), '{}'::jsonb), coalesce(jsonb_object_agg(k, p_fields->k), '{}'::jsonb)
      into old_vals, new_vals
      from unnest(cols || array['location']) k
      where p_fields ? k and (p_fields->k) is distinct from (old_row->k);
    if new_vals = '{}'::jsonb then return 'unchanged'; end if;

    update listings l set
      title = case when p_fields ? 'title' then trim(p_fields->>'title') else l.title end,
      provider_name = case when p_fields ? 'provider_name' then nullif(trim(p_fields->>'provider_name'), '') else l.provider_name end,
      website = case when p_fields ? 'website' then nullif(trim(p_fields->>'website'), '') else l.website end,
      delivery_mode = case when p_fields ? 'delivery_mode' then p_fields->>'delivery_mode' else l.delivery_mode end,
      location_area = case when p_fields ? 'location_area' then p_fields->>'location_area' else l.location_area end,
      address = case when p_fields ? 'address' then p_fields->>'address' else l.address end,
      postcode = case when p_fields ? 'postcode' then p_fields->>'postcode' else l.postcode end,
      location = case when p_fields ? 'location' then (p_fields->>'location')::geography else l.location end,
      address_source = case when p_fields ? 'address_source' then p_fields->>'address_source' else l.address_source end,
      format = case when p_fields ? 'format' then p_fields->>'format' else l.format end,
      category = case when p_fields ? 'category' then p_fields->>'category' else l.category end,
      age_min_months = case when p_fields ? 'age_min_months' then (p_fields->>'age_min_months')::int else l.age_min_months end,
      age_max_months = case when p_fields ? 'age_max_months' then (p_fields->>'age_max_months')::int else l.age_max_months end,
      languages = case when p_fields ? 'languages' then array(select jsonb_array_elements_text(p_fields->'languages')) else l.languages end,
      runs_when = case when p_fields ? 'runs_when' then p_fields->>'runs_when' else l.runs_when end,
      days_of_week = case when p_fields ? 'days_of_week' then array(select jsonb_array_elements_text(p_fields->'days_of_week')) else l.days_of_week end,
      time_of_day = case when p_fields ? 'time_of_day' then array(select jsonb_array_elements_text(p_fields->'time_of_day')) else l.time_of_day end,
      start_time = case when p_fields ? 'start_time' then (p_fields->>'start_time')::time else l.start_time end,
      end_time = case when p_fields ? 'end_time' then (p_fields->>'end_time')::time else l.end_time end,
      event_date = case when p_fields ? 'event_date' then (p_fields->>'event_date')::date else l.event_date end,
      event_end_date = case when p_fields ? 'event_end_date' then (p_fields->>'event_end_date')::date else l.event_end_date end,
      schedule_text = case when p_fields ? 'schedule_text' then p_fields->>'schedule_text' else l.schedule_text end,
      price_text = case when p_fields ? 'price_text' then p_fields->>'price_text' else l.price_text end,
      description = case when p_fields ? 'description' then p_fields->>'description' else l.description end,
      -- Shows as "Not yet confirmed" again; the 90/120-day clock restarts from the edit
      status = 'Check',
      last_confirmed_at = now()
    where l.id = p_id;

    insert into listing_edits (listing_id, user_id, before, after) values (p_id, me, old_vals, new_vals);
    return 'saved';
  end $$;

  revoke execute on function public.edit_listing(text, jsonb) from public;
  grant execute on function public.edit_listing(text, jsonb) to authenticated;

  -- Visible, not your own, not edited by you in the last 30 days, and you haven't confirmed it in the last 30 days
  create or replace function public.can_confirm(p_listing text) returns boolean
  language sql stable security definer set search_path = public as $$
    select exists (select 1 from listings l
                   where l.id = p_listing and l.status in ('Active', 'Check')
                     and l.created_by is distinct from auth.uid())
       and not exists (select 1 from listing_confirmations c
                       where c.listing_id = p_listing and c.user_id = auth.uid()
                         and c.created_at > now() - interval '30 days')
       and not exists (select 1 from listing_edits e
                       where e.listing_id = p_listing and e.user_id = auth.uid() and not e.undone
                         and e.created_at > now() - interval '30 days');
  $$;
