export function shortenHash(
  hash: string,
  prefixLength = 2,
  suffixLength = 2,
): string {
  if (!hash) return '';
  if (hash.length <= prefixLength + suffixLength) return hash;

  const start = hash.slice(0, prefixLength);
  const end = hash.slice(-suffixLength);
  return `${start}...${end}`;
}
