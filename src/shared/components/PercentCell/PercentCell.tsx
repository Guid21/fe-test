import { formatCompact } from '@/shared/features/scanner/utils/formatCompact';

type PercentCellProps = {
  value: number | string;
  className?: string;
};

export function PercentCell({ value, className }: PercentCellProps) {
  if (value == null || value === '')
    return <span className="text-gray-400">-</span>;

  const num = typeof value === 'number' ? value : Number(value);
  if (Number.isNaN(num))
    return <span className="text-gray-400">{String(value)}</span>;
  const abs = Math.abs(num);

  const rounded = Math.round(num);

  let color = 'text-gray-400';
  let sign = '';

  if (rounded > 0) {
    color = 'text-green-500';
    sign = '+';
  } else if (rounded < 0) {
    color = 'text-red-500';
  }

  if (abs >= 1000) {
    return (
      <span className={`${color} ${className ?? ''}`}>
        {formatCompact(num, 1)}%
      </span>
    );
  }

  return (
    <span className={`${color} ${className ?? ''}`}>
      {sign}
      {rounded}%
    </span>
  );
}
