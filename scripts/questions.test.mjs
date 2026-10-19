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
