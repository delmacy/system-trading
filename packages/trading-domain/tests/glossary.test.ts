import { describe, it } from 'node:test';
import * as assert from 'node:assert';
import {
  getGlossaryTerm,
  glossary,
  listGlossaryTerms,
  validateGlossary,
} from '../src/glossary.js';

describe('Published ubiquitous language', () => {
  it('should publish the canonical glossary and read terms back', () => {
    assert.ok(glossary.length >= 20);
    const backtest = getGlossaryTerm('Backtest');
    assert.strictEqual(backtest.term, 'Backtest');
    assert.match(backtest.definition, /dataset versionado/i);
    assert.strictEqual(backtest.category, 'process');
  });

  it('should read back every term published in the glossary', () => {
    for (const entry of glossary) {
      assert.deepStrictEqual(getGlossaryTerm(entry.term), entry);
    }
  });

  it('should list all published terms when no category is given', () => {
    assert.strictEqual(listGlossaryTerms().length, glossary.length);
  });

  it('should list terms filtered by decision category', () => {
    const decisions = listGlossaryTerms('decision');
    assert.ok(decisions.length > 0);
    assert.ok(decisions.every((entry) => entry.category === 'decision'));
    assert.deepStrictEqual(
      decisions.map((entry) => entry.term).sort(),
      ['Allocation', 'Order Intent', 'Risk Decision'].sort(),
    );
  });

  it('should list terms filtered by value category', () => {
    assert.deepStrictEqual(
      listGlossaryTerms('value').map((entry) => entry.term).sort(),
      ['Feature', 'Fill'].sort(),
    );
  });

  it('should fail meaningfully when reading an unknown term', () => {
    assert.throws(() => getGlossaryTerm('UnknownTerm'), /Unknown glossary term: UnknownTerm/);
  });

  it('should reject a glossary with duplicate terms', () => {
    assert.throws(
      () => validateGlossary([...glossary, glossary[0]]),
      /Duplicate glossary term: Account/,
    );
  });

  it('should reject an empty glossary', () => {
    assert.throws(() => validateGlossary([]), /Glossary must contain at least one term/);
  });

  it('should reject a term with an empty definition', () => {
    assert.throws(
      () => validateGlossary([{ term: 'New', definition: '', category: 'entity', status: 'canonical' }]),
      /String must contain at least 1 character/,
    );
  });

  it('should reject an invalid category', () => {
    assert.throws(
      () =>
        validateGlossary([
          { term: 'New', definition: 'definition', category: 'invalid', status: 'canonical' },
        ]),
      /Invalid enum value/,
    );
  });

  it('should reject an invalid term status', () => {
    assert.throws(
      () =>
        validateGlossary([
          { term: 'New', definition: 'definition', category: 'entity', status: 'obsolete' },
        ]),
      /Invalid enum value/,
    );
  });

  it('should accept a provisional term as valid input', () => {
    const result = validateGlossary([
      { term: 'Preliminary', definition: 'term under review', category: 'process', status: 'provisional' },
    ]);
    assert.strictEqual(result[0].status, 'provisional');
  });
});
