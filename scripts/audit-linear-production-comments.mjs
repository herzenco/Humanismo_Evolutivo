import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const failures = [];

const read = (relativePath) =>
  fs.readFileSync(path.join(root, relativePath), 'utf8');

const requireText = (relativePath, expected, label) => {
  if (!read(relativePath).includes(expected)) {
    failures.push(`${label}: ${relativePath} is missing ${JSON.stringify(expected)}`);
  }
};

const rejectText = (relativePath, rejected, label) => {
  if (read(relativePath).includes(rejected)) {
    failures.push(`${label}: ${relativePath} still contains ${JSON.stringify(rejected)}`);
  }
};

const sourceFiles = [];
const collectSourceFiles = (directory) => {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      collectSourceFiles(fullPath);
    } else if (/\.(ts|tsx)$/.test(entry.name)) {
      sourceFiles.push(fullPath);
    }
  }
};

collectSourceFiles(path.join(root, 'src'));

for (const file of sourceFiles) {
  const relativePath = path.relative(root, file);
  const lines = fs.readFileSync(file, 'utf8').split('\n');

  lines.forEach((line, index) => {
    if (/\bconciencias?\b/i.test(line) && !line.includes('slug:')) {
      failures.push(
        `HER-194/HER-204/HER-206: legacy spelling in ${relativePath}:${index + 1}`,
      );
    }
  });
}

requireText('src/data/books.ts', "title: '¡Dejalo Ser!'", 'HER-200');
requireText(
  'src/contexts/LanguageContext.tsx',
  "'book.dejaloser.title': '¡Dejalo Ser!'",
  'HER-200',
);
requireText('src/app/vision/page.tsx', 'Año 2020', 'HER-203');
rejectText('src/app/vision/page.tsx', 'M(XX)', 'HER-203');

for (const relativePath of [
  'src/data/legalDocuments.ts',
  'src/components/legal/LegalDocumentPage.tsx',
  'src/app/privacidad/page.tsx',
  'src/app/terminos/page.tsx',
]) {
  rejectText(relativePath, 'yosoynosotros.org', 'HER-201/HER-202');
}
requireText(
  'src/data/legalDocuments.ts',
  'https://www.humanismoevolutivo.com',
  'HER-201/HER-202',
);
requireText('src/data/legalDocuments.ts', "title: 'Privacy Policy'", 'HER-201');
requireText('src/data/legalDocuments.ts', "title: 'Terms of Use'", 'HER-202');
requireText(
  'src/data/legalDocuments.ts',
  'hello@humanismoevolutivo.com',
  'HER-201/HER-202',
);
rejectText(
  'src/data/legalDocuments.ts',
  'contacto@humanismoevolutivo.org',
  'HER-201/HER-202',
);
requireText(
  'src/components/legal/LegalDocumentPage.tsx',
  "part === 'hello@humanismoevolutivo.com'",
  'HER-201/HER-202',
);

requireText('src/app/medios/page.tsx', 'object-contain', 'HER-204');
requireText('src/app/medios/show/[showId]/page.tsx', 'object-contain', 'HER-204');
requireText(
  'src/data/showLongform.ts',
  'A partir de esa base, los episodios profundizan',
  'HER-205',
);

requireText('docs/faq-draft.md', '## Español', 'HER-193');
requireText('docs/faq-draft.md', '## English', 'HER-193');
requireText('docs/faq-draft.md', 'No está publicado', 'HER-193');
if (fs.existsSync(path.join(root, 'src/app/faq'))) {
  failures.push('HER-193: the FAQ draft must not be published as a route before approval');
}

const translationsSource = read('src/contexts/LanguageContext.tsx');
const spanish = translationsSource.slice(
  translationsSource.indexOf('  es: {'),
  translationsSource.indexOf('\n  en: {'),
);
const english = translationsSource.slice(
  translationsSource.indexOf('  en: {'),
  translationsSource.indexOf('\n  }\n};', translationsSource.indexOf('  en: {')),
);
const translationKeys = (source) =>
  [...source.matchAll(/^\s*'([^']+)'\s*:/gm)].map((match) => match[1]);

const spanishKeys = translationKeys(spanish);
const englishKeys = translationKeys(english);
const englishKeySet = new Set(englishKeys);
const missingEnglishKeys = spanishKeys.filter((key) => !englishKeySet.has(key));
if (missingEnglishKeys.length > 0) {
  failures.push(`HER-192: missing English keys: ${missingEnglishKeys.join(', ')}`);
}

for (const [language, keys] of [
  ['Spanish', spanishKeys],
  ['English', englishKeys],
]) {
  const duplicates = keys.filter((key, index) => keys.indexOf(key) !== index);
  if (duplicates.length > 0) {
    failures.push(`${language} translation keys are duplicated: ${[...new Set(duplicates)].join(', ')}`);
  }
}

requireText('src/components/layout/Footer.tsx', 'text-white/85', 'HER-196');
requireText('src/components/layout/Footer.tsx', 'border-white/20', 'HER-196');
requireText('src/components/layout/Footer.tsx', '<NewsletterSignup />', 'HER-197');
requireText('src/components/layout/NewsletterSignup.tsx', "name=\"email\"", 'HER-197');
requireText('src/app/actions/newsletter.ts', ".from('newsletter_subscriptions')", 'HER-197');
requireText(
  'src/app/actions/newsletter.ts',
  'NEWSLETTER_SUPABASE_PUBLISHABLE_KEY',
  'HER-197',
);
requireText(
  'supabase/migrations/20260908154044_create_newsletter_subscriptions.sql',
  'grant insert (email, locale)',
  'HER-197',
);
rejectText('src/components/layout/Footer.tsx', 'leadconnectorhq.com', 'HER-197');
rejectText('src/components/layout/Footer.tsx', '<iframe', 'HER-197');
requireText(
  'src/contexts/LanguageContext.tsx',
  "'footer.newsletter.success': '¡Gracias! Tu correo quedó registrado.'",
  'HER-197',
);
requireText(
  'src/contexts/LanguageContext.tsx',
  "'footer.newsletter.success': 'Thank you! Your email has been saved.'",
  'HER-197',
);

for (const [relativePath, expected] of [
  ['src/app/layout.tsx', 'Humanismo Evolutivo Transpersonal - Marcos Constandse Madrazo'],
  ['src/data/books.ts', 'filosofía del Humanismo Evolutivo Transpersonal'],
  ['src/data/legalDocuments.ts', 'información sobre Humanismo Evolutivo Transpersonal'],
  ['src/contexts/LanguageContext.tsx', 'philosophy of Transpersonal Evolutionary Humanism'],
  ['src/components/layout/Footer.tsx', 'Fundación Humanismo Evolutivo Transpersonal'],
  ['docs/faq-draft.md', 'What is Transpersonal Evolutionary Humanism?'],
]) {
  requireText(relativePath, expected, 'HER-195/HER-198/HER-199/HER-204/HER-207');
}

if (failures.length > 0) {
  console.error(failures.map((failure) => `- ${failure}`).join('\n'));
  process.exit(1);
}

console.log(
  `Linear production-comment audit passed: ${spanishKeys.length} Spanish keys have English coverage; copy, legal, media, FAQ draft, newsletter, spelling, and contrast checks passed.`,
);
