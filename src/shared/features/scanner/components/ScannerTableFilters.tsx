import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import type { ColumnFiltersState } from '@tanstack/react-table';

type ScannerTableFiltersProps = {
  setColumnFilters: React.Dispatch<React.SetStateAction<ColumnFiltersState>>;
};

const ageOptions = [
  { label: 'any', hours: null },
  { label: '1h', hours: 1 },
  { label: '3h', hours: 3 },
  { label: '6h', hours: 6 },
  { label: '12h', hours: 12 },
  { label: '24h', hours: 24 },
];

const chainOptions = [
  { label: 'All chains', symbol: null },
  { label: 'ETH', symbol: 'ETH' },
  { label: 'SOL', symbol: 'SOL' },
  { label: 'BASE', symbol: 'BASE' },
  { label: 'BSC', symbol: 'BSC' },
];

export const ScannerTableFilters = ({
  setColumnFilters,
}: ScannerTableFiltersProps) => {
  return (
    <div>
      <Menu as="div" className="relative inline-block">
        <MenuButton className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white/10 px-3 py-2 text-sm font-semibold text-white inset-ring-1 inset-ring-white/5 hover:bg-white/20 bg-amber-950">
          Age
          <ChevronDownIcon
            aria-hidden="true"
            className="-mr-1 size-5 text-gray-400"
          />
        </MenuButton>

        <MenuItems
          transition
          className="absolute right-0 z-10 mt-2  origin-top-right divide-y divide-white/10 rounded-md bg-gray-800 outline-1 -outline-offset-1 outline-white/10 transition data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
        >
          {ageOptions.map(({ label, hours }) => (
            <div className="py-1" key={hours}>
              <MenuItem>
                {() => (
                  <button
                    onClick={() => {
                      setColumnFilters((prev) => {
                        const others = prev.filter(
                          (f) => f.id !== 'tokenCreatedTimestamp',
                        );

                        if (hours == null) return others;

                        const sinceISO = new Date(
                          Date.now() - hours * 60 * 60 * 1000,
                        ).toISOString();

                        return [
                          ...others,
                          { id: 'tokenCreatedTimestamp', value: sinceISO },
                        ];
                      });
                    }}
                    className={`block w-full px-4 py-2 text-left text-sm`}
                  >
                    {label}
                  </button>
                )}
              </MenuItem>
            </div>
          ))}
        </MenuItems>
      </Menu>
      <Menu as="div" className="relative inline-block">
        <MenuButton className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white/10 px-3 py-2 text-sm font-semibold text-white inset-ring-1 inset-ring-white/5 hover:bg-white/20 bg-amber-950">
          Cahins
          <ChevronDownIcon
            aria-hidden="true"
            className="-mr-1 size-5 text-gray-400"
          />
        </MenuButton>

        <MenuItems
          transition
          className="absolute right-0 z-10 mt-2  origin-top-right divide-y divide-white/10 rounded-md bg-gray-800 outline-1 -outline-offset-1 outline-white/10 transition data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
        >
          {chainOptions.map(({ label, symbol }) => (
            <div className="py-1" key={symbol}>
              <MenuItem>
                {() => (
                  <button
                    onClick={() => {
                      setColumnFilters((prev) => {
                        const others = prev.filter(
                          (f) => f.id !== 'tokenSymbol',
                        );

                        if (symbol == null) return others;

                        return [
                          ...others,
                          { id: 'tokenSymbol', value: symbol },
                        ];
                      });
                    }}
                    className={`block w-full px-4 py-2 text-left text-sm`}
                  >
                    {label}
                  </button>
                )}
              </MenuItem>
            </div>
          ))}
        </MenuItems>
      </Menu>
    </div>
  );
};
