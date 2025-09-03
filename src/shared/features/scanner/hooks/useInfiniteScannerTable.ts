import { useInfiniteScannerData } from './useInfiniteScannerData';
import type { FetchScannerParams } from '../api';

type UseInfiniteScannerTableParams = FetchScannerParams;
export function useInfiniteScannerTable(
  defaultParams?: UseInfiniteScannerTableParams,
) {
  const { data, ...rest } = useInfiniteScannerData(defaultParams);

  return { ...rest, data: data ?? [] };
}
