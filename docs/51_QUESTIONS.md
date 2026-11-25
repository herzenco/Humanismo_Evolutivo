# The 51 questions

The homepage section `#s5` links to `/51preguntas`. The directory lists all published question titles with server-rendered links. Each question has a stable URL `/51preguntas/pregunta_<number>`, for numbers 1 through 51; changing a title does not change its URL.

## Supplied source material

The 51 Markdown files were supplied in `HUMANISMO EVOLUTIVO/VIDEOS SITIO WEB/51 PREGUNTAS/Pregunta <number>/Pregunta <number>.md`. Unmodified copies are stored in `content/questions/pregunta_<number>.md`.

Each page displays the supplied question as its heading and only the narrated version as its reading text. The dialogue remains archived in the source and generated data but is not displayed or included in article structured data. Each page shows one video, preferring the horizontal version when supplied and otherwise using the first available video. All supplied variants remain archived in the media manifest. Production annotations such as estimated recording duration/word count are kept in the Markdown sources but omitted from the published reading text. Speaker emphasis is rendered safely as React markup. No author name or original publication date has been inferred.

Questions 1–34 already have published videos. The [horizontal source folder](https://drive.google.com/drive/folders/1zpMt9L_Ufl8jbemteQoHZdNsGWqzWJNZ) contains the numbered QuickTime originals. Some filenames include a `P` or extra spaces before the extension. The [question source folders](https://drive.google.com/drive/folders/1tRYADooXrAOK56wW_4kpq2QccEig-VZE) contain the text for questions 35–51. These question pages show the availability form until video metadata is present. Optimized MP4s and posters are served from the project's public Vercel Blob store.

## Regenerate the content

The public asset manifest is `content/questions/media.json`; it contains URLs, duration and relative source filenames, not credentials. Regenerate the typed content data with:

```bash
node scripts/import-questions.mjs content/questions content/questions/media.json
```

The importer also accepts the original `51 PREGUNTAS` folder as its first argument. It validates numbering and both script formats, preserves the source files and writes `src/generated/questions.json`. Question descriptions are excerpts from the supplied narration. The site consumes generated content through `src/data/questions.ts`.

When new videos arrive, encode them as browser-compatible MP4s with fast-start playback, upload video and poster assets, add their records to the manifest with `orientation: "horizontal"`, and regenerate. The question page will replace the form with the player. The question origin tag under Boletín identifies people who requested the availability notice. Never store media access credentials or full-size original videos in Git.

## Discovery and metadata

Published questions render their full answer text, unique title/description, production canonical URL, article/breadcrumb structured data and previous/next navigation. Published question URLs and the directory are included in the sitemap. Missing, invalid and unpublished question URLs return 404. Search engines decide whether and when to index pages; deploying a route does not guarantee indexing.

Run `npm test` and `npm run build` after changing content. Promote through feature → dev → qa → main using the established release process.
