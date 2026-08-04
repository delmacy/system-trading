import { describe, it } from 'node:test';
import * as assert from 'node:assert';
import {
  architectureDecisions,
  getArchitectureDecision,
  listArchitectureDecisions,
  validateArchitectureDecisions,
} from '../src/architecture-decisions.js';

describe('Published architecture decisions', () => {
  it('should publish the initial architecture decisions and read them back', () => {
    assert.ok(architectureDecisions.length >= 2);
    const foundation = getArchitectureDecision('ADR-0001');
    assert.strictEqual(foundation.status, 'Accepted');
    assert.strictEqual(foundation.scope, 'platform');
    assert.match(foundation.summary, /System Builder/);
  });

  it('should read back every published ADR', () => {
    for (const adr of architectureDecisions) {
      assert.deepStrictEqual(getArchitectureDecision(adr.adr_id), adr);
    }
  });

  it('should list decisions filtered by platform scope', () => {
    const platform = listArchitectureDecisions('platform');
    assert.ok(platform.every((adr) => adr.scope === 'platform'));
    assert.deepStrictEqual(
      platform.map((adr) => adr.adr_id),
      ['ADR-0001'],
    );
  });

  it('should list decisions filtered by trading scope', () => {
    const trading = listArchitectureDecisions('trading');
    assert.ok(trading.length > 0);
    assert.ok(trading.every((adr) => adr.scope === 'trading'));
  });

  it('should fail meaningfully when reading an unknown ADR', () => {
    assert.throws(
      () => getArchitectureDecision('ADR-9999'),
      /Unknown architecture decision: ADR-9999/,
    );
  });

  it('should reject duplicate ADR ids', () => {
    assert.throws(
      () => validateArchitectureDecisions([...architectureDecisions, architectureDecisions[0]]),
      /Duplicate ADR id: ADR-0001/,
    );
  });

  it('should reject an invalid ADR id format', () => {
    assert.throws(
      () =>
        validateArchitectureDecisions([
          {
            adr_id: 'ADR-1',
            title: 'Invalid',
            status: 'Accepted',
            scope: 'trading',
            summary: 'summary',
            decisions: ['decision'],
            rules: [],
          },
        ]),
      /Invalid ADR id/,
    );
  });

  it('should reject an ADR without decisions', () => {
    assert.throws(
      () =>
        validateArchitectureDecisions([
          {
            adr_id: 'ADR-0003',
            title: 'Empty decisions',
            status: 'Accepted',
            scope: 'trading',
            summary: 'summary',
            decisions: [],
            rules: [],
          },
        ]),
      /Array must contain at least 1 element/,
    );
  });

  it('should reject an invalid status', () => {
    assert.throws(
      () =>
        validateArchitectureDecisions([
          {
            adr_id: 'ADR-0003',
            title: 'Invalid status',
            status: 'Approved',
            scope: 'trading',
            summary: 'summary',
            decisions: ['decision'],
            rules: [],
          },
        ]),
      /Invalid enum value/,
    );
  });

  it('should accept an ADR with a decided_at timestamp', () => {
    const result = validateArchitectureDecisions([
      {
        adr_id: 'ADR-0003',
        title: 'With timestamp',
        status: 'Accepted',
        scope: 'trading',
        decided_at: '2026-08-04T00:00:00Z',
        summary: 'summary',
        decisions: ['decision'],
        rules: [],
      },
    ]);
    assert.strictEqual(result[0].decided_at, '2026-08-04T00:00:00Z');
  });
});
