-- Adds "Museums" as an activity (category).
-- Paste into the Supabase SQL editor and run once.

do $$
declare c text;
begin
  for c in select conname from pg_constraint
    where conrelid = 'public.listings'::regclass and contype = 'c' and pg_get_constraintdef(oid) like '%category%'
  loop
    execute format('alter table public.listings drop constraint %I', c);
  end loop;
end $$;

alter table public.listings add constraint listings_category_check check (category in (
  'Languages', 'Arts / Crafts', 'Performing arts', 'Sports / Dance', 'Chess',
  'STEM / Thinking', 'Childcare / Preschool', 'Outdoor / Nature', 'Soft play', 'Museums',
  'Events / Parties', 'Life skills', 'Mixed'));
