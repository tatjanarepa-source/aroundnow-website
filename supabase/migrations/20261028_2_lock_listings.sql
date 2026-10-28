-- Make copying the whole database harder, step 2 of 2. Run AFTER the app using listings_near is deployed (v22).
-- Until now anyone with the app's public key could download every listing in one request.
-- After this, the listings table only shows people the classes they added themselves (needed right after adding one);
-- everything else goes through listings_near, which answers for one area at a time.
-- Admin scripts use the secret key and are not affected.

drop policy if exists "Public can read visible listings" on public.listings;
drop policy if exists "People can read what they added" on public.listings;
create policy "People can read what they added" on public.listings
  for select to authenticated using (created_by is not null and created_by = auth.uid());

revoke select on public.listings from anon;

-- The old search function could return every listing at once (any radius); the app doesn't use it
revoke execute on function public.search_listings from public, anon, authenticated;
