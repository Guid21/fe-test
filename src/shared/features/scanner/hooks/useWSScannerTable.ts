import { wsManager } from '@/shared/api/wsManager';
import { useWSMessage } from '@/shared/hooks/useWSMessage';
import {
  chainIdToName,
  type GetScannerResultParams,
  type IncomingWebSocketMessage,
} from '@/shared/test-task-types';
import type { SupportedChainName } from '@/types';
import { useCallback, useState } from 'react';
import { createPairKey, normalizeScannerResponse } from '../utils/helpers';
import { useQueryClient, type InfiniteData } from '@tanstack/react-query';
import type { FetchScannerParams } from '../api';
import type { PairsData } from '../types';

type UseInfiniteScannerTableParams = {
  queryKey: (string | FetchScannerParams | undefined)[];
};
export function useWSScannerTable({ queryKey }: UseInfiniteScannerTableParams) {
  const queryClient = useQueryClient();
  const [activeSubscriptions, setActiveSubscriptions] = useState<Set<string>>(
    new Set(),
  );

  const subscribeScannerFilter = useCallback(
    (params: FetchScannerParams) => {
      const subscriptionKey = `scanner-filter-${JSON.stringify(params)}`;

      if (activeSubscriptions.has(subscriptionKey)) {
        return;
      }

      const data: GetScannerResultParams & {
        callers: string[];
        algos: string[];
        tgConn: string[];
        users: string[];
        wallets: string[];
      } = {
        callers: [],
        algos: [],
        tgConn: [],
        users: [],
        wallets: [],
        rankBy: params.rankBy,
      };

      if (params.page && params.page > 1) {
        data.page = params.page.toString() as unknown as number;
      }

      wsManager.send({
        event: 'scanner-filter',
        data: data,
      });

      setActiveSubscriptions((prev) => new Set(prev).add(subscriptionKey));
    },
    [activeSubscriptions],
  );

  const unsubscribeScanner = useCallback(
    (pairAddress: string, token1Address: string, chain: SupportedChainName) => {
      const subscriptionKey = `subscribe-pair-${pairAddress}-${token1Address}-${chain}`;

      wsManager.send({
        event: 'unsubscribe-pair',
        data: {
          pair: pairAddress,
          token: token1Address,
          chain: chain,
        },
      });
      setActiveSubscriptions((prev) => {
        const newSet = new Set(prev);
        newSet.delete(subscriptionKey);
        return newSet;
      });
    },
    [],
  );
  const subscribeScanner = useCallback(
    (pairAddress: string, token1Address: string, chain: SupportedChainName) => {
      const subscriptionKey = `subscribe-pair-${pairAddress}-${token1Address}-${chain}`;

      if (activeSubscriptions.has(subscriptionKey)) {
        return;
      }

      wsManager.send({
        event: 'subscribe-pair',
        data: {
          pair: pairAddress,
          token: token1Address,
          chain: chain,
        },
      });

      setActiveSubscriptions((prev) => new Set(prev).add(subscriptionKey));
    },
    [activeSubscriptions],
  );

  const unsubscribeScannerStats = useCallback(
    (pairAddress: string, token1Address: string, chain: SupportedChainName) => {
      const subscriptionKey = `subscribe-pair-stats-${pairAddress}-${token1Address}-${chain}`;

      wsManager.send({
        event: 'unsubscribe-pair-stats',
        data: {
          pair: pairAddress,
          token: token1Address,
          chain: chain,
        },
      });
      setActiveSubscriptions((prev) => {
        const newSet = new Set(prev);
        newSet.delete(subscriptionKey);
        return newSet;
      });
    },
    [],
  );
  const subscribeScannerStats = useCallback(
    (pairAddress: string, token1Address: string, chain: SupportedChainName) => {
      const subscriptionKey = `subscribe-pair-stats-${pairAddress}-${token1Address}-${chain}`;

      if (activeSubscriptions.has(subscriptionKey)) {
        return;
      }

      wsManager.send({
        event: 'subscribe-pair-stats',
        data: {
          pair: pairAddress,
          token: token1Address,
          chain: chain,
        },
      });

      setActiveSubscriptions((prev) => new Set(prev).add(subscriptionKey));
    },
    [activeSubscriptions],
  );

  const subscriptionPair = useCallback(
    (
      data: (
        | {
            pairAddress: string;
            token1Address: string;
            chainId: number;
          }
        | undefined
      )[],
    ) => {
      data.map((data) => {
        if (!data) {
          return;
        }
        const { pairAddress, token1Address, chainId } = data;
        const chain = chainIdToName(chainId);
        subscribeScanner(pairAddress, token1Address, chain);
        subscribeScannerStats(pairAddress, token1Address, chain);
      });
    },
    [subscribeScanner, subscribeScannerStats],
  );
  const unsubscribePair = useCallback(
    (
      data: (
        | { pairAddress: string; token1Address: string; chainId: number }
        | undefined
      )[],
    ) => {
      data.map((data) => {
        if (!data) {
          return;
        }
        const { pairAddress, token1Address, chainId } = data;
        const chain = chainIdToName(chainId);
        unsubscribeScanner(pairAddress, token1Address, chain);
        unsubscribeScannerStats(pairAddress, token1Address, chain);
      });
    },
    [unsubscribeScanner, unsubscribeScannerStats],
  );

  const subscriptionPairs = useCallback(
    ({ entered, exited }: { entered: string[]; exited: string[] }) => {
      const oldData =
        queryClient.getQueryData<InfiniteData<PairsData>>(queryKey);

      if (!oldData) {
        return;
      }

      const enteredPairs = entered.map((pairKey) => {
        for (const page of oldData.pages) {
          const pair = page?.data.pairsMap?.[pairKey];

          if (pair) {
            return {
              pairAddress: pair.pairAddress,
              token1Address: pair.token1Address,
              chainId: pair.chainId,
            };
          }
        }
        return undefined;
      });

      subscriptionPair(enteredPairs);
      const exitedPairs = exited.map((pairKey) => {
        for (const page of oldData.pages) {
          const pair = page?.data.pairsMap?.[pairKey];
          if (pair) {
            return {
              pairAddress: pair.pairAddress,
              token1Address: pair.token1Address,
              chainId: pair.chainId,
            };
          }
        }
        return undefined;
      });
      unsubscribePair(exitedPairs);
    },
    [queryClient, queryKey, subscriptionPair, unsubscribePair],
  );

  const pairStatsUpdate = useCallback(
    (pairStatsEvent: IncomingWebSocketMessage) => {
      if (pairStatsEvent.event === 'pair-stats') {
        const data = pairStatsEvent.data;
        queryClient.setQueryData<InfiniteData<PairsData>>(
          queryKey,
          (oldData) => {
            if (!oldData) {
              return oldData;
            }

            const pairKey = createPairKey(
              data.pair.chain,
              data.pair.pairAddress,
            );
            let changed = false;
            const pages = oldData.pages.map((page) => {
              const pair = page?.data.pairsMap?.[pairKey];
              if (!pair) return page;

              changed = true;
              return {
                ...page,
                data: {
                  ...page.data,
                  pairsMap: {
                    ...page.data.pairsMap,
                    [pairKey]: {
                      ...pair,
                      migrationProgress: data.migrationProgress,
                      discordLink: data.pair.linkDiscord,
                      telegramLink: data.pair.linkTelegram,
                      twitterLink: data.pair.linkTwitter,
                      webLink: data.pair.linkWebsite,
                      dexPaid: data.pair.dexPaid,
                      isFreezeAuthDisabled: data.pair.freezeAuthorityRenounced,
                      isMintAuthDisabled: data.pair.mintAuthorityRenounced,
                      honeyPot: !data.pair.token1IsHoneypot,
                      contractVerified: data.pair.isVerified,
                    },
                  },
                },
              };
            });

            return changed
              ? {
                  ...oldData,
                  pages,
                }
              : oldData;
          },
        );
      } else if (pairStatsEvent.event === 'tick') {
        const data = pairStatsEvent.data;
        const latestSwap = data.swaps?.filter((swap) => !swap.isOutlier)?.pop();
        if (latestSwap) {
          queryClient.setQueryData<InfiniteData<PairsData>>(
            queryKey,
            (oldData) => {
              if (!oldData) return oldData;

              const pairKey = createPairKey(data.pair.chain, data.pair.pair);

              let changed = false;
              const pages = oldData.pages.map((page) => {
                const pair = page?.data.pairsMap?.[pairKey];
                if (!pair) return page;

                const isBuy =
                  latestSwap.tokenInAddress?.toLowerCase() ===
                  pair.token1Address?.toLowerCase();
                const amt1Raw = Number(latestSwap.amountToken1 ?? 0);
                const amt1 = Number.isFinite(amt1Raw) ? Math.abs(amt1Raw) : 0;
                const totalSupply = Number(
                  pair.token1TotalSupplyFormatted ?? 0,
                );

                const volDeltaUsd =
                  amt1 * Number(latestSwap.priceToken1Usd ?? 0);
                const prevBuys = Number(pair.buys ?? pair.buys ?? 0);
                const prevSells = Number(pair.sells ?? pair.sells ?? 0);
                const prevVol = Number(pair.volume ?? pair.volume ?? 0);

                const nextBuys = prevBuys + (isBuy ? 1 : 0);
                const nextSells = prevSells + (!isBuy ? 1 : 0);
                const newPrice = Number(latestSwap.priceToken1Usd ?? 0);
                const newMarketCap = totalSupply * newPrice;
                const nextVol =
                  prevVol + (Number.isFinite(volDeltaUsd) ? volDeltaUsd : 0);

                changed = true;
                return {
                  ...page,
                  data: {
                    ...page.data,
                    pairsMap: {
                      ...page.data.pairsMap,
                      [pairKey]: {
                        ...pair,
                        buys: nextBuys,
                        sells: nextSells,
                        volume: String(nextVol),
                        price: String(newPrice),
                        currentMcap: String(newMarketCap),
                        _rt: { priceUpdatedAt: Date.now() },
                      },
                    },
                  },
                };
              });

              return changed ? { ...oldData, pages } : oldData;
            },
          );
        }
      } else if (pairStatsEvent.event === 'scanner-pairs') {
        const data = pairStatsEvent.data;
        const page = Number(data.filter.page || 1);
        const params: GetScannerResultParams = {
          page: 1,
        };
        if (data.filter.rankBy === 'age') {
          params.rankBy = data.filter.rankBy;
        }

        const results = data.results;

        queryClient.setQueryData<InfiniteData<PairsData>>(
          ['scanner', 'infinite', params],
          (oldData) => {
            if (!oldData) return oldData;

            const targetIndex = page - 1;

            return {
              ...oldData,
              pages: oldData.pages.map((oldPage, index) => {
                if (index === targetIndex) {
                  const normalizedPage = normalizeScannerResponse({
                    data: {
                      pairs: results.pairs,
                      totalRows: results.totalRows,
                    },
                  });

                  return {
                    data: {
                      pairsMap: normalizedPage.data.pairsKeys.reduce<
                        PairsData['data']['pairsMap']
                      >((acc, pairKey) => {
                        const newPair = normalizedPage.data.pairsMap[pairKey];
                        const oldPair = oldPage.data.pairsMap[pairKey];
                        const isChanged = !!(
                          oldPair as unknown as { _rt: Date }
                        )?._rt;
                        return {
                          ...acc,
                          [pairKey]: {
                            ...newPair,
                            price: isChanged ? oldPair.price : newPair.price,
                            currentMcap: isChanged
                              ? oldPair.currentMcap
                              : newPair.currentMcap,
                          },
                        };
                      }, {}),
                      pairsKeys: normalizedPage.data.pairsKeys,
                    },
                    totalRows: normalizedPage.totalRows,
                  };
                }

                return oldPage;
              }),
              pageParams: oldData.pageParams,
            };
          },
        );
      }
    },
    [queryClient, queryKey],
  );

  useWSMessage(pairStatsUpdate);

  return {
    subscriptionPairs,
    subscribeScannerFilter,
  };
}
