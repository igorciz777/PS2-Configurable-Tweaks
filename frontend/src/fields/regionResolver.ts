import type { AddressMap } from './FieldConfig';

export function resolveAddress(
  address: string | AddressMap,
  region?: string,
): string {
  if (typeof address === 'string') return address;
  if (region && address[region] !== undefined) return address[region]!;
  return address['_'] ?? '';
}

export function resolveHex(
  hex: string | AddressMap | undefined,
  region?: string,
): string {
  if (hex === undefined) return '00000000';
  if (typeof hex === 'string') return hex;
  if (region && hex[region] !== undefined) return hex[region]!;
  return hex['_'] ?? '00000000';
}
