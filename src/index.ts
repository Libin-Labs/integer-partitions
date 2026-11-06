function finite(value: number, min = -Number.MAX_VALUE, max = Number.MAX_VALUE): number {
  if (typeof value !== 'number' || !Number.isFinite(value))
    throw new TypeError('Expected finite number');
  if (value < min || value > max) throw new RangeError('Number outside supported bounds');
  return value;
}
function integer(value: number, min = 0, max = 1000000): number {
  if (!Number.isSafeInteger(value)) throw new RangeError('Expected safe integer');
  return finite(value, min, max);
}
export function countPartitions(n: number, maxPart = n): bigint {
  integer(n, 0, 1000);
  integer(maxPart, 0, 1000);
  const dp: bigint[] = Array(n + 1).fill(0n);
  dp[0] = 1n;
  for (let p = 1; p <= Math.min(n, maxPart); p++)
    for (let k = p; k <= n; k++) dp[k] = dp[k]! + dp[k - p]!;
  return dp[n]!;
}
export function enumeratePartitions(n: number, maxPart = n, maxResults = 10000): number[][] {
  integer(n, 0, 50);
  integer(maxPart, 0, 50);
  integer(maxResults, 1, 100000);
  const out: number[][] = [],
    path: number[] = [];
  function visit(remaining: number, cap: number): void {
    if (remaining === 0) {
      if (out.length >= maxResults) throw new RangeError('Partition result budget');
      out.push([...path]);
      return;
    }
    for (let p = Math.min(remaining, cap); p >= 1; p--) {
      path.push(p);
      visit(remaining - p, p);
      path.pop();
    }
  }
  visit(n, maxPart);
  return out;
}
