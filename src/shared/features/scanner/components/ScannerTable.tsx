import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnFiltersState,
} from '@tanstack/react-table';
import { dataScannerTableColumns } from '../utils/dataTableColumns';
import type { TokenData } from '../types';
import { memo, useEffect, useRef, useState } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import cn from 'classnames';
import React from 'react';
import { ScannerTableFilters } from './ScannerTableFilters';

type VisibleChange = {
  entered: string[];
  exited: string[];
  allVisible: string[];
};

type ScannerTableProps = {
  title: string;
  data: TokenData[];
  className?: string;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: () => void;
  onVisibleRowsChange?: (change: VisibleChange) => void;
  isLoading: boolean;
  isFetching: boolean;
  isError: boolean;
  totalRows: number;
};

function ScannerTable({
  title,
  data,
  className,
  hasNextPage,
  isFetchingNextPage,
  totalRows,
  fetchNextPage,
  onVisibleRowsChange,
  isLoading,
  isFetching,
  isError,
}: ScannerTableProps) {
  //we need a reference to the scrolling element for logic down below
  const tableContainerRef = React.useRef<HTMLDivElement>(null);
  const prevVisibleRef = useRef<Set<string>>(new Set());
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const table = useReactTable({
    data,
    state: {
      columnFilters,
    },
    onColumnFiltersChange: setColumnFilters,
    columns: dataScannerTableColumns,
    getFilteredRowModel: getFilteredRowModel(),
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualSorting: false,
    debugTable: false,
  });

  const { rows } = table.getRowModel();

  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    estimateSize: () => 33, //estimate row height for accurate scrollbar dragging
    getScrollElement: () => tableContainerRef.current,
    //measure dynamic row height, except in firefox because it measures table border height incorrectly
    measureElement:
      typeof window !== 'undefined' &&
      navigator.userAgent.indexOf('Firefox') === -1
        ? (element) => element?.getBoundingClientRect().height
        : undefined,
    overscan: 5,
  });

  const virtualItems = rowVirtualizer.getVirtualItems();
  useEffect(() => {
    if (!onVisibleRowsChange) return;

    const rows = table.getRowModel().rows;

    const visibleIds = new Set(
      virtualItems
        .map((vi) => rows[vi.index]?.original.id)
        .filter(Boolean) as string[],
    );

    const prev = prevVisibleRef.current;

    const entered: string[] = [];
    const exited: string[] = [];

    for (const id of visibleIds) {
      if (!prev.has(id)) entered.push(id);
    }
    for (const id of prev) {
      if (!visibleIds.has(id)) exited.push(id);
    }

    prevVisibleRef.current = visibleIds;

    if (entered.length || exited.length) {
      onVisibleRowsChange({
        entered,
        exited,
        allVisible: Array.from(visibleIds),
      });
    }
  }, [virtualItems, table, onVisibleRowsChange]);

  useEffect(() => {
    if (!virtualItems.length) return;
    const last = virtualItems[virtualItems.length - 1];
    const lastItemIndex = last.index;
    const loadedCount = table.getRowModel().rows.length;

    const threshold = 10;
    const nearEnd = lastItemIndex >= loadedCount - 1 - threshold;

    if (nearEnd && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [virtualItems, hasNextPage, isFetchingNextPage, fetchNextPage, table]);

  if (isLoading) {
    return (
      <div
        className={cn(
          className,
          'w-full h-screen bg-[#22262b] text-emerald-300 ',
        )}
      >
        Loading...
      </div>
    );
  }

  if (isError) {
    return (
      <div
        className={cn(
          className,
          'w-full h-screen bg-[#22262b] text-orange-700',
        )}
      >
        Error
      </div>
    );
  }

  return (
    <div
      className={cn(
        'w-full h-screen text-amber-50 flex flex-col bg-[#22262b] overflow-auto',
        className,
      )}
    >
      <div className="flex-none flex flex-col items-center mb-3 px-3">
        <h2 className="text-2xl font-bold">{title}</h2>
      </div>
      ({data.length} of {totalRows} rows fetched)
      <ScannerTableFilters setColumnFilters={setColumnFilters} />
      <div ref={tableContainerRef} className={'relative overflow-auto h-full'}>
        {/* Even though we're still using sematic table tags, we must use CSS grid and flexbox for dynamic row heights */}
        <table style={{ display: 'grid' }}>
          <thead
            style={{
              display: 'grid',
              position: 'sticky',
              top: 0,
              zIndex: 1,
            }}
          >
            {table.getHeaderGroups().map((headerGroup) => (
              <tr
                key={headerGroup.id}
                style={{ display: 'flex', width: '100%' }}
              >
                {headerGroup.headers.map((header) => {
                  return (
                    <th
                      key={header.id}
                      style={{
                        display: 'flex',
                        width: header.getSize(),
                      }}
                      className="bg-black"
                    >
                      <div
                        {...{
                          className: header.column.getCanSort()
                            ? 'cursor-pointer select-none'
                            : '',
                          onClick: header.column.getToggleSortingHandler(),
                        }}
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                        {{
                          asc: ' 🔼',
                          desc: ' 🔽',
                        }[header.column.getIsSorted() as string] ?? null}
                      </div>
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
          <tbody
            style={{
              display: 'grid',
              height: `${rowVirtualizer.getTotalSize()}px`, //tells scrollbar how big the table is
              position: 'relative', //needed for absolute positioning of rows
            }}
            className="text-sm"
          >
            {rowVirtualizer.getVirtualItems().map((virtualRow) => {
              const row = rows[virtualRow.index];
              return (
                <tr
                  data-index={virtualRow.index} //needed for dynamic row height measurement
                  ref={(node) => rowVirtualizer.measureElement(node)} //measure dynamic row height
                  key={row.id}
                  style={{
                    display: 'flex',
                    position: 'absolute',
                    transform: `translateY(${virtualRow.start}px)`, //this should always be a `style` as it changes on scroll
                    width: '100%',
                  }}
                >
                  {row.getVisibleCells().map((cell) => {
                    return (
                      <td
                        key={cell.id}
                        style={{
                          display: 'flex',
                          width: cell.column.getSize(),
                        }}
                        className="min-w-0 overflow-hidden items-center"
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {isFetching && <div className="text-emerald-300">Fetching More...</div>}
    </div>
  );
}

export default memo(ScannerTable);
