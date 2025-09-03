import ScannerTable from '@/shared/features/scanner/components/ScannerTable';
import { useInfiniteScannerTable } from '../hooks/useInfiniteScannerTable';

export function ScannerTables() {
  const {
    data: trendingData,
    fetchNextPage: fetchNextTrendingPage,
    hasNextPage: hasNextTrendingPage,
    isFetchingNextPage: isFetchingTrending,
    subscriptionPairs: subscriptionTradingPairs,
    isLoading: isLoadingTrending,
    isFetching: isFetchingTrading,
    isError: isErrorTrading,
  } = useInfiniteScannerTable();

  const {
    data: newData,
    fetchNextPage: fetchNextNewPage,
    hasNextPage: hasNextNewPage,
    isFetchingNextPage: isFetchingNew,
    subscriptionPairs: subscriptionNewPairs,
    isLoading: isLoadingNew,
    isFetching: isFetchingNewPairs,
    isError: isErrorNew,
  } = useInfiniteScannerTable({ rankBy: 'age' });

  return (
    <div className="flex gap-2 w-full">
      <ScannerTable
        data={trendingData.data}
        fetchNextPage={fetchNextTrendingPage}
        hasNextPage={hasNextTrendingPage}
        isFetchingNextPage={isFetchingTrending}
        title="Trending Tokens"
        className="flex-1"
        onVisibleRowsChange={subscriptionTradingPairs}
        isLoading={isLoadingTrending}
        isFetching={isFetchingTrading}
        totalRows={trendingData.totalRows}
        isError={isErrorTrading}
      />
      <ScannerTable
        data={newData.data}
        fetchNextPage={fetchNextNewPage}
        hasNextPage={hasNextNewPage}
        isFetchingNextPage={isFetchingNew}
        title="New Tokens"
        className="flex-1"
        onVisibleRowsChange={subscriptionNewPairs}
        isLoading={isLoadingNew}
        isFetching={isFetchingNewPairs}
        totalRows={trendingData.totalRows}
        isError={isErrorNew}
      />
    </div>
  );
}
