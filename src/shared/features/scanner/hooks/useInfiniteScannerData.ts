import { useInfiniteQuery } from '@tanstack/react-query';
import { fetchScanner, type FetchScannerParams } from '../api';
import { normalizeScannerResponse } from '../utils/helpers';
import { useMemo, useState } from 'react';
import { chainIdToName } from '@/shared/test-task-types';
import { pickMcap } from '../utils/pickMcap';
import { useWSScannerTable } from './useWSScannerTable';

type UseInfiniteScannerDataParams = FetchScannerParams;

export function useInfiniteScannerData(
  defaultParams?: UseInfiniteScannerDataParams,
) {
  const [params, setParams] = useState(() => {
    return { ...defaultParams, page: defaultParams?.page ?? 1 };
  });
  const queryKey = useMemo(() => ['scanner', 'infinite', params], [params]);
  const { subscriptionPairs, subscribeScannerFilter } = useWSScannerTable({
    queryKey,
  });

  const result = useInfiniteQuery({
    queryKey,
    queryFn: async ({ pageParam = 1 }) => {
      const data = await fetchScanner({ ...params, page: pageParam });

      subscribeScannerFilter({ ...params, page: pageParam });
      return {
        ...normalizeScannerResponse({
          data,
        }),
        totalRows: data.totalRows,
      };
    },
    subscribed: true,
    initialPageParam: 1,
    select: (data) => {
      return {
        totalRows: data.pages[0].totalRows,
        data:
          data?.pages.flatMap((page) =>
            page.data.pairsKeys.flatMap((pairKey) => {
              const pair = page.data.pairsMap[pairKey];

              return {
                id: pairKey,
                tokenName: pair.token1Name,
                tokenSymbol: pair.token1Symbol,
                tokenAddress: pair.token1Address,
                pairAddress: pair.pairAddress,
                chain: chainIdToName(pair.chainId),
                exchange: pair.virtualRouterType ?? pair.routerAddress,
                priceUsd: Number(pair.price) || 0,
                volumeUsd: Number(pair.volume) || 0,
                mcap: pickMcap(pair),
                priceChangePcs: {
                  '5m': Number(pair.diff5M) || 0,
                  '1h': Number(pair.diff1H) || 0,
                  '6h': Number(pair.diff6H) || 0,
                  '24h': Number(pair.diff24H) || 0,
                },
                transactions: {
                  buys: Number(pair.buys) || 0,
                  sells: Number(pair.sells) || 0,
                },
                // TODO: Mock
                audit: {
                  mintable: pair.isMintAuthDisabled,
                  freezable: pair.isFreezeAuthDisabled,
                  honeypot: Boolean(pair.honeyPot),
                  contractVerified: pair.contractVerified,
                },
                tokenCreatedTimestamp: new Date(pair.age),
                liquidity: {
                  current: Number(pair.liquidity ?? 0),
                  changePc: Number(pair.percentChangeInLiquidity ?? 0),
                },
              };
            }),
          ) || [],
      };
    },
    getNextPageParam: (lastPage, pages) => {
      const loaded = pages.reduce(
        (n, p) => n + (p.data.pairsKeys?.length ?? 0),
        0,
      );

      return loaded < lastPage.totalRows ? pages.length + 1 : undefined;
    },
  });

  return {
    ...result,
    data: result.data || {
      totalRows: 0,
      data: [],
    },
    setParams,
    subscriptionPairs,
  };
}
