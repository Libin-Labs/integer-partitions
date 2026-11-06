import { countPartitions, enumeratePartitions } from '@lp-labs/integer-partitions';
if (countPartitions(5) !== 7n || enumeratePartitions(5).length !== 7) throw new Error('Partitions');
// @ts-expect-error invalid argument must be rejected by declarations
countPartitions(5n);
