const UNITS = ['', 'K', 'M', 'B', 'T', 'Q'];

export function formatCompact(n: number, digits = 1) {
  const abs = Math.abs(n);
  if (abs < 1000) return n.toLocaleString();

  const unit = Math.min(Math.floor(Math.log10(abs) / 3), UNITS.length - 1);
  const scaled = n / Math.pow(1000, unit);
  const str = scaled.toFixed(digits).replace(/\.0+$|(\.\d*?[1-9])0+$/, '$1');
  return `${str}${UNITS[unit]}`;
}
