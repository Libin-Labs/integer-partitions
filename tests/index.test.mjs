import assert from 'node:assert/strict';
import test from 'node:test';
import * as api from '../dist/esm/index.js';
test('partition reference counts', () => {
  for (const [n, c] of [
    [0, 1n],
    [5, 7n],
    [10, 42n],
    [100, 190569292n],
  ])
    assert.equal(api.countPartitions(n), c);
});
test('restricted part sizes', () => {
  assert.equal(api.countPartitions(5, 2), 3n);
  assert.deepEqual(api.enumeratePartitions(4, 2), [
    [2, 2],
    [2, 1, 1],
    [1, 1, 1, 1],
  ]);
});
test('zero and impossible', () => {
  assert.deepEqual(api.enumeratePartitions(0, 0), [[]]);
  assert.equal(api.countPartitions(5, 0), 0n);
});
test('enumeration budgets', () => {
  assert.throws(() => api.enumeratePartitions(5, 5, 6));
  assert.throws(() => api.enumeratePartitions(51));
  assert.throws(() => api.countPartitions(1001));
});
test('invalid numeric arguments', () => {
  assert.throws(() => api.countPartitions(-1));
  assert.throws(() => api.countPartitions(2.5));
  assert.throws(() => api.enumeratePartitions(3, 3, 0));
});
test('enumeration structural oracle', () => {
  for (let n = 0; n <= 20; n++) {
    const rows = api.enumeratePartitions(n);
    assert.equal(BigInt(rows.length), api.countPartitions(n));
    assert.equal(new Set(rows.map((x) => x.join())).size, rows.length);
    for (const row of rows) {
      assert.equal(
        row.reduce((a, b) => a + b, 0),
        n,
      );
      assert.ok(row.every((x, i) => x > 0 && (i === 0 || row[i - 1] >= x)));
    }
  }
});
