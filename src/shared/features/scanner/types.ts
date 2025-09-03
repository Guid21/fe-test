import type { ScannerResult } from '@/shared/test-task-types';

export type PairsData = {
  data: { pairsMap: Record<string, ScannerResult>; pairsKeys: string[] };
};

export type TokenData = {
  id: string;
  tokenName: string;
  tokenSymbol: string;
  tokenAddress: string;
  pairAddress: string;
  chain: 'ETH' | 'SOL' | 'BASE' | 'BSC';
  exchange: string; // this is the router or virtualRouter fields
  priceUsd: number;
  volumeUsd: number;
  mcap: number;
  priceChangePcs: {
    '5m': number;
    '1h': number;
    '6h': number;
    '24h': number;
  };
  transactions: {
    buys: number;
    sells: number;
  };
  audit: {
    mintable: boolean;
    freezable: boolean;
    honeypot: boolean;
    contractVerified: boolean;
  };
  tokenCreatedTimestamp: Date;
  liquidity: {
    current: number;
    changePc: number;
  };
};
