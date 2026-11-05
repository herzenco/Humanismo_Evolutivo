import test from 'node:test';
import assert from 'node:assert/strict';
import { publishedQuestions, questionBySlug, questionPath } from '../src/data/questions.ts';

function question(number, overrides = {}) {
  return { number, title: `Question ${number}`, description: 'A question description.', status: 'published', sections: [{ paragraphs: ['An answer supplied for testing.'] }], ...overrides };
}

test('only complete published answers are available for links and indexing', () => {
  const draft = question(2, { status: 'draft', sections: [] });
  assert.deepEqual(publishedQuestions([question(3), draft, question(1)]).map(item => item.number), [1, 3]);
  assert.equal(questionBySlug('pregunta_2', [draft]), undefined);
  assert.throws(() => publishedQuestions([question(1, { sections: [] })]), /needs a title, description and answer/);
  assert.throws(() => publishedQuestions([question(1, { sections: [{ paragraphs: ['  '] }] })]), /needs a title, description and answer/);
});

test('question URLs use the exact requested numbering and reject duplicate aliases', () => {
  const source = [question(1), question(51)];
  assert.equal(questionPath(1), '/51preguntas/pregunta_1');
  assert.equal(questionPath(51), '/51preguntas/pregunta_51');
  assert.equal(questionBySlug('pregunta_51', source)?.number, 51);
  for (const slug of ['pregunta_01', 'pregunta_0', 'pregunta_52', 'pregunta_1-extra', '1']) {
    assert.equal(questionBySlug(slug, source), undefined);
  }
});

test('duplicate numbers and invalid publication metadata prevent ambiguous pages', () => {
  assert.throws(() => publishedQuestions([question(1), question(1)]), /Duplicate/);
  for (const number of [0, 52, 1.5]) assert.throws(() => publishedQuestions([question(number)]), /integers from 1 to 51/);
  assert.throws(() => publishedQuestions([question(1, { publishedAt: 'invalid' })]), /Invalid date/);
});

test('all 51 supplied questions preserve their Markdown titles and both complete text versions', async () => {
  const { readFile } = await import('node:fs/promises');
  const published = publishedQuestions();
  assert.equal(published.length, 51);
  assert.deepEqual(published.map(item => item.number), Array.from({ length: 51 }, (_, index) => index + 1));
  for (const item of published) {
    const source = await readFile(new URL(`../content/questions/pregunta_${item.number}.md`, import.meta.url), 'utf8');
    assert.equal(item.title, source.split('\n')[0].replace(/^# Pregunta \d+: /, ''));
    assert.deepEqual(item.sections.map(section => section.kind), ['narration', 'dialogue']);
    assert.equal(item.sections[1].paragraphs.length, 3);
    for (const section of item.sections) {
      for (const paragraph of section.paragraphs) assert.ok(source.includes(paragraph), `Question ${item.number} contains text absent from its source.`);
    }
  }
});

test('published video variants stay paired with their supplied question and missing videos are explicit', () => {
  const published = publishedQuestions();
  let count = 0;
  for (const item of published) {
    const videos = item.videos || [];
    assert.equal(videos.length, item.number <= 10 ? 3 : item.number <= 25 ? 2 : 0, `Question ${item.number} video inventory differs from the supplied folders.`);
    for (const video of videos) {
      assert.ok(video.src.includes(`/51preguntas/pregunta_${item.number}/`));
      assert.ok(video.poster.includes(`/51preguntas/pregunta_${item.number}/`));
      assert.ok(video.durationSeconds > 0);
    }
    assert.equal(new Set(videos.map(video => video.src)).size, videos.length);
    count += videos.length;
  }
  assert.equal(count, 60);
});
