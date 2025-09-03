import type {
  GetScannerResultParams,
  OrderBy,
  SerdeRankBy,
  ScannerApiResponse,
  SupportedChainName,
  TimeFrame,
} from '@/shared/test-task-types';
import { client } from '@shared/api/client';
import qs from 'qs';

export type FetchScannerParams = Omit<GetScannerResultParams, 'page'> & {
  orderBy?: OrderBy;
  rankBy?: SerdeRankBy;
  page?: number;
  chain?: SupportedChainName;
  timeFrame?: TimeFrame;
  userId?: null;
};

export async function fetchScanner(params?: FetchScannerParams) {
  const query = qs.stringify(params, {
    arrayFormat: 'repeat',
    skipNulls: true,
  });

  const { data } = await client.get<ScannerApiResponse>(`/scanner?${query}`);
  return data;
}
