import type { ScannerResult } from '@/shared/test-task-types';

export function pickMcap(pair: ScannerResult): number {
  const order = [
    pair.currentMcap,
    pair.initialMcap,
    pair.pairMcapUsd,
    pair.pairMcapUsdInitial,
  ];
  const val = order.map((x) => Number(x || 0)).find((x) => x > 0);
  return val ?? 0;
}
