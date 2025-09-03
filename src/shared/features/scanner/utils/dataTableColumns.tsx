import { createColumnHelper } from '@tanstack/react-table';
import type { TokenData } from '../types';
import { NetworkLogo } from '@/shared/components/NetworkLogo';
import { formatTimeDiff } from '@/shared/utils/formatTimeDiff';
import { shortenHash } from '@/shared/utils/shortenHash';
import { NumberCell } from '@/shared/components/NumberCellProps/NumberCellProps';
import { PercentCell } from '@/shared/components/PercentCell/PercentCell';

const columnHelper = createColumnHelper<TokenData>();

export const dataScannerTableColumns = [
  columnHelper.accessor('tokenSymbol', {
    header: 'Token',
    size: 400,
    filterFn: (row, columnId, filterValue) => {
      console.log(filterValue, row.original.chain);
      if (!filterValue) {
        return true;
      }
      return row.original.chain === filterValue;
    },
    cell: (info) => (
      <div className="relative flex items-center gap-3 pl-3 py-2 text-nowrap">
        <div className="relative z-10 flex items-center gap-2">
          <div className="flex flex-row gap-2">
            <div className="flex items-center gap-1">
              {info.row.index + 1}
              <span className="text-xs row-counter">#</span>
              <span className="font-medium text-sm">
                {info.row.original.tokenSymbol}
              </span>
              <span>/</span>
              <span className="font-medium text-sm">
                {info.row.original.tokenName}
              </span>
            </div>
            <div className="flex items-center gap-1 mt-1">
              <NetworkLogo chainName={info.row.original.chain} />
            </div>
          </div>
        </div>
      </div>
    ),
  }),
  columnHelper.accessor('exchange', {
    header: 'Exchange',
    cell: (info) => {
      return shortenHash(info.row.original.exchange);
    },
  }),
  columnHelper.accessor('priceUsd', {
    header: 'Price',
    cell: (info) => {
      return (
        <>
          $<NumberCell value={info.row.original.priceUsd} />
        </>
      );
    },
  }),
  columnHelper.accessor('mcap', {
    header: 'Marketcap',
    cell: (info) => (
      <>
        $<NumberCell value={info.row.original.mcap} />
      </>
    ),
  }),
  columnHelper.accessor('volumeUsd', {
    header: 'Volume',
    cell: (info) => (
      <>
        $<NumberCell value={info.row.original.volumeUsd} />
      </>
    ),
  }),
  columnHelper.accessor('priceChangePcs.5m', {
    header: '5M',
    cell: (info) => (
      <PercentCell value={info.row.original.priceChangePcs['5m']} />
    ),
  }),
  columnHelper.accessor('priceChangePcs.1h', {
    header: '1H',
    cell: (info) => (
      <PercentCell value={info.row.original.priceChangePcs['1h']} />
    ),
  }),
  columnHelper.accessor('priceChangePcs.6h', {
    header: '6H',
    cell: (info) => (
      <PercentCell value={info.row.original.priceChangePcs['6h']} />
    ),
  }),
  columnHelper.accessor('priceChangePcs.24h', {
    header: '24H',
    cell: (info) => (
      <PercentCell value={info.row.original.priceChangePcs['24h']} />
    ),
  }),
  columnHelper.accessor('tokenCreatedTimestamp', {
    header: 'Age',
    cell: (info) => (
      <>{formatTimeDiff(info.row.original.tokenCreatedTimestamp)}</>
    ),
    filterFn: (row, columnId, filterValue) => {
      return (
        new Date(row.getValue(columnId)).valueOf() >=
        new Date(filterValue).valueOf()
      );
    },
  }),
  columnHelper.accessor('transactions', {
    header: 'Buys/Sells',
    cell: (info) => (
      <div className="flex flex-col items-center gap-1">
        <span className="text-xs text-gray-500">
          <NumberCell
            className="text-green-500"
            value={info.row.original.transactions.buys}
          />
          /
          <NumberCell
            className="text-red-500"
            value={info.row.original.transactions.sells}
          />
        </span>
      </div>
    ),
  }),

  columnHelper.accessor('liquidity', {
    header: 'Liquidity',
    cell: (info) => (
      <div className="flex flex-col items-center gap-1">
        <span className="text-xs text-gray-500">
          <NumberCell
            className="text-green-500"
            value={info.row.original.liquidity.current}
          />
          /
          <NumberCell
            className="text-red-500"
            value={info.row.original.liquidity.changePc}
          />
        </span>
      </div>
    ),
  }),
];
