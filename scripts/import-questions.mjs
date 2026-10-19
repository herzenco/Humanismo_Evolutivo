import { readFile, access, mkdir, writeFile, copyFile } from 'node:fs/promises';
import { resolve, join } from 'node:path';

const source = process.argv[2];
if (!source) throw new Error('Usage: node scripts/import-questions.mjs <51 PREGUNTAS folder> [video manifest.json]');
const media = process.argv[3] ? JSON.parse(await readFile(process.argv[3], 'utf8')) : {};
const records = [];
const plain = text => text.replace(/\*\*/g, '').replace(/\*/g, '').trim();
const paragraphs = text => text.split(/\n\s*\n/).map(block => block.trim()).filter(block => block && block !== '---' && !block.startsWith('*Duración estimada:') && !block.startsWith('*Spot de cierre'));
await mkdir('content/questions', { recursive: true });
await mkdir('src/generated', { recursive: true });
for (let number = 1; number <= 51; number++) {
  const folder = join(resolve(source), `Pregunta ${number}`);
  let markdownPath = join(folder, `Pregunta ${number}.md`);
  try { await access(markdownPath); } catch { markdownPath = join(resolve(source), `pregunta_${number}.md`); }
  const markdown = await readFile(markdownPath, 'utf8');
  const heading = markdown.match(/^# Pregunta (\d+): (.+)$/m);
  if (!heading || Number(heading[1]) !== number) throw new Error(`Missing/mismatched question title ${number}`);
  const narrationMarker = /\*\*① VERSIÓN NARRADA\*\*[^\n]*\n/;
  const dialogueMarker = /\*\*② VERSIÓN DIÁLOGO\*\*[^\n]*\n/;
  const narrationStart = markdown.match(narrationMarker);
  const dialogueStart = markdown.match(dialogueMarker);
  if (!narrationStart || !dialogueStart) throw new Error(`Missing narrated/dialogue version ${number}`);
  const narration = paragraphs(markdown.slice(narrationStart.index + narrationStart[0].length, dialogueStart.index));
  const dialogue = paragraphs(markdown.slice(dialogueStart.index + dialogueStart[0].length));
  if (!narration.length || !dialogue.length) throw new Error(`Empty answer ${number}`);
  const summary = plain(narration[0]);
  const description = summary.length <= 160 ? summary : `${summary.slice(0, 157).replace(/\s+\S*$/, '')}…`;
  const videos = ['horizontal', 'dialogue', 'narration'].flatMap(kind => {
    const asset = media[`${number}/${kind}`];
    if (!asset) return [];
    return [{
      label: kind === 'horizontal' ? 'Diálogo (horizontal)' : kind === 'dialogue' ? (media[`${number}/horizontal`] ? 'Diálogo (vertical)' : 'Diálogo') : 'Narración',
      kind: kind === 'narration' ? 'narration' : 'dialogue',
      orientation: kind === 'horizontal' ? 'horizontal' : 'vertical',
      src: asset.src,
      poster: asset.poster,
      durationSeconds: asset.durationSeconds,
      uploadedAt: asset.uploadedAt,
    }];
  });
  records.push({ number, title: heading[2].trim(), description, status: 'published', sections: [{ kind: 'narration', heading: 'Versión narrada', paragraphs: narration }, { kind: 'dialogue', heading: 'Diálogo entre Platón, Sócrates y Aristóteles', paragraphs: dialogue }], videos, sourceTitle: '51 Preguntas · Dos Formatos' });
  const destination = `content/questions/pregunta_${number}.md`;
  if (resolve(markdownPath) !== resolve(destination)) await copyFile(markdownPath, destination);
}
await writeFile('src/generated/questions.json', `${JSON.stringify(records, null, 2)}\n`);
console.log(`Imported ${records.length} questions; ${records.filter(record => record.videos.length).length} with hosted videos.`);
