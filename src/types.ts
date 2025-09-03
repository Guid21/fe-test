export type SupportedChainName = 'ETH' | 'SOL' | 'BASE' | 'BSC';
export type SupportedChainId = '1' | '11155111' | '900' | '8453' | '56';

export type OrderBy = 'asc' | 'desc';
export type TimeFrame = '5M' | '1H' | '6H' | '24H';
export type SerdeRankBy =
  | 'price5M'
  | 'price1H'
  | 'price6H'
  | 'price24H'
  | 'volume'
  | 'txns'
  | 'buys'
  | 'sells'
  | 'trending'
  | 'age'
  | 'liquidity'
  | 'mcap'
  | 'migration';
