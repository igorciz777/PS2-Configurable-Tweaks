import type { AddressMap } from './FieldConfig';

export function resolveAddress(
  address: string | AddressMap,
  region?: string,
): string {
  if (typeof address === 'string') return address;
  const entries = Object.entries(address);
  if (entries.length === 0) return '';
  const [firstKey] = entries[0];
  if (region && address[region] !== undefined) return address[region]!;
  return firstKey;
}
