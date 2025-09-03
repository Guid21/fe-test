import { QueryClient } from '@tanstack/react-query';
import {
  chainIdToName,
  type ScannerApiResponse,
  type SupportedChainName,
} from '@/shared/test-task-types';
import type { PairsData } from '../types';
import { scannerPairsKey } from '../models';

export const createPairKey = (
  chain: SupportedChainName,
  pairAddress: string,
) => {
  return `${chain}_${pairAddress}`;
};

type NormalizeScannerResponseParams = { data: ScannerApiResponse };

export function normalizeScannerResponse({
  data: { pairs, ...rest },
}: NormalizeScannerResponseParams) {
  const result = pairs.reduce<PairsData>(
    (acc, pair) => {
      const pairKey = createPairKey(
        chainIdToName(pair.chainId),
        pair.pairAddress,
      );

      return {
        data: {
          pairsKeys: [...acc.data.pairsKeys, pairKey],
          pairsMap: { ...acc.data.pairsMap, [pairKey]: pair },
        },
      };
    },
    {
      data: {
        pairsKeys: [],
        pairsMap: {},
      },
    },
  );

  return { ...rest, ...result };
}

export const getPairsData = (queryClient: QueryClient): PairsData => {
  return (
    queryClient.getQueryData(scannerPairsKey) ?? {
      data: {
        pairsMap: {},
        pairsKeys: [],
      },
    }
  );
};

export function getPairByKey(pairKey: string, queryClient: QueryClient) {
  const pairsData = getPairsData(queryClient);

  return pairsData.data.pairsMap[pairKey];
}
