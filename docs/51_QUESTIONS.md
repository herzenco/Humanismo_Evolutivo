# The 51 questions

The homepage section `#s5` links to `/51preguntas`. The directory lists all published question titles with server-rendered links. Each question has a stable URL `/51preguntas/pregunta_<number>`, for numbers 1 through 51; changing a title does not change its URL.

## Supplied source material

The 51 Markdown files were supplied in `HUMANISMO EVOLUTIVO/VIDEOS SITIO WEB/51 PREGUNTAS/Pregunta <number>/Pregunta <number>.md`. Unmodified copies are stored in `content/questions/pregunta_<number>.md`.

Each page preserves the supplied question title, narrated version and three-character dialogue. Production annotations such as estimated recording duration/word count are kept in the Markdown sources but omitted from the published reading text. Speaker emphasis is rendered safely as React markup. No author name or original publication date has been inferred.

The original folder includes video files for questions 1–25. Questions 26–51 have Markdown only. For 1–10, horizontal dialogue, vertical dialogue and vertical narration are available; 11–25 have vertical dialogue and narration. Original MOV files remain in the source folders. Optimized H.264/AAC MP4 copies and JPEG posters are served from the project's public Vercel Blob store, not from Git or the application deployment bundle.

## Regenerate the content

The public asset manifest is `content/questions/media.json`; it contains URLs, duration and relative source filenames, not credentials. Regenerate the typed content data with:

```bash
node scripts/import-questions.mjs content/questions content/questions/media.json
```

The importer also accepts the original `51 PREGUNTAS` folder as its first argument. It validates numbering and both script formats, preserves the source files and writes `src/generated/questions.json`. Question descriptions are excerpts from the supplied narration. The site consumes generated content through `src/data/questions.ts`.

When new videos arrive, encode them as browser-compatible MP4s with fast-start playback, upload video and poster assets, add their records to the manifest, and regenerate. Never store media access credentials or full-size original videos in Git.

## Discovery and metadata

Published questions render their full answer text, unique title/description, production canonical URL, article/breadcrumb structured data and previous/next navigation. Published question URLs and the directory are included in the sitemap. Missing, invalid and unpublished question URLs return 404. Search engines decide whether and when to index pages; deploying a route does not guarantee indexing.

Run `npm test` and `npm run build` after changing content. Promote through feature → dev → qa → main using the established release process.
