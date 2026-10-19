# The 51 questions

The homepage section `#s5` links to `/51preguntas`. That directory lists published questions using normal server-rendered links. Each question has a stable URL `/51preguntas/pregunta_<number>`, for numbers 1 through 51; changing a title does not change its URL.

## Add supplied content

Populate `questions` in `src/data/questions.ts` with the user's actual question titles and answers. Each entry has:

- `number`: unique integer between 1 and 51.
- `title`: the full question.
- `description`: a concise, content-specific summary used in the directory and metadata.
- `status`: `draft` or `published`.
- `sections`: answer sections containing an optional `heading` and a `paragraphs` array. Text is rendered as escaped React text, not arbitrary HTML.
- Optional `author`, `publishedAt` and `updatedAt`: include only when supplied or verified.

Do not publish placeholder answers, invented questions, or fake author/publication metadata. Published entries require a title, description and answer. Drafts are excluded from listing links, static page generation and the sitemap; their URLs return 404. Invalid numbers, duplicate numbers and malformed publication dates fail validation.

## Discovery and metadata

Published questions are rendered with their complete answer, a unique title/description, a canonical URL on `https://humanismoevolutivo.com`, article and breadcrumb structured data, and previous/next links between published questions. The sitemap includes the directory and published question URLs once actual content exists.

The empty directory is available for QA review with `noindex, follow`; no empty question pages are published. Once the first answer is published the directory becomes indexable. Search engines decide whether and when to index pages; deploying a route does not guarantee indexing.

Run `npm test` and `npm run build` after adding content. Promote through feature → dev → qa → main using the established release process.
