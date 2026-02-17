alter table "public"."profiles" enable row level security;


  create policy "Profiles are insertable by the owner"
  on "public"."profiles"
  as permissive
  for insert
  to authenticated
with check ((auth.uid() = id));



  create policy "Profiles are updatable by the owner"
  on "public"."profiles"
  as permissive
  for update
  to authenticated
using ((auth.uid() = id))
with check ((auth.uid() = id));



  create policy "Profiles are viewable by the owner"
  on "public"."profiles"
  as permissive
  for select
  to authenticated
using ((auth.uid() = id));



