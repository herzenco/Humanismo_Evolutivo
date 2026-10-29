-- The live podcast row for this missing slug points at a 3.3 MB PNG.
-- Point it at the compressed WebP. No-op when the legacy table is absent.
do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'podcast_series' and column_name = 'cover_image_url'
  ) then
    update public.podcast_series
    set cover_image_url = '/design/podcasts/lo-mejor-esta-por-venir.webp'
    where cover_image_url like '%null-podcast-cover%';
  end if;
end $$;
