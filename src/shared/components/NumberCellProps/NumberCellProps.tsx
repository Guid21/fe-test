import { formatCompact } from '@/shared/features/scanner/utils/formatCompact';

type NumberCellProps = {
  value: number | string;
  tinySignificantDigits?: number;
  compactDigits?: number;
  compactLarge?: boolean;
  className?: string;
};

function renderTiny(n: number, significant = 4, className?: string) {
  const expStr = n.toExponential(Math.max(1, significant - 1));
  const [mantissaStr, expRaw] = expStr.split('e-');
  const exp = Number(expRaw);
  const digits = mantissaStr.replace('.', '');
  const zeros = Math.max(0, exp - 1);
  const head = (
    <span>
      0.0<span className="text-xs align-bottom opacity-80">{zeros}</span>
    </span>
  );

  return (
    <span className={className}>
      {head}
      <span className="">{digits}</span>
    </span>
  );
}

export function NumberCell({
  value,
  tinySignificantDigits = 4,
  compactDigits = 1,
  compactLarge = true,
  className,
}: NumberCellProps) {
  if (value == null || value === '')
    return <span className={className}>-</span>;

  const num = typeof value === 'number' ? value : Number(value);
  if (Number.isNaN(num))
    return <span className={className}>{String(value)}</span>;

  const abs = Math.abs(num);

  if (abs > 0 && abs < 0.001) {
    return renderTiny(num, tinySignificantDigits, className);
  }

  if (compactLarge && abs >= 1000) {
    return (
      <span className={className}>{formatCompact(num, compactDigits)}</span>
    );
  }

  return <span className={className}>{num.toLocaleString()}</span>;
}
