drop policy "Profiles are insertable by the owner" on "public"."profiles";

drop policy "Profiles are updatable by the owner" on "public"."profiles";

drop policy "Profiles are viewable by the owner" on "public"."profiles";


  create policy "Profiles are insertable by the owner"
  on "public"."profiles"
  as permissive
  for insert
  to authenticated
with check ((( SELECT auth.uid() AS uid) = id));



  create policy "Profiles are updatable by the owner"
  on "public"."profiles"
  as permissive
  for update
  to authenticated
using ((( SELECT auth.uid() AS uid) = id))
with check ((( SELECT auth.uid() AS uid) = id));



  create policy "Profiles are viewable by the owner"
  on "public"."profiles"
  as permissive
  for select
  to authenticated
using ((( SELECT auth.uid() AS uid) = id));



