import type { TweakValues } from '../fields/FieldConfig';

function toBase64Url(str: string): string {
  return btoa(str).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function fromBase64Url(str: string): string {
  let s = str.replace(/-/g, '+').replace(/_/g, '/');
  while (s.length % 4) s += '=';
  return atob(s);
}

export function encodeValues(values: TweakValues): string {
  return toBase64Url(JSON.stringify(values));
}

export function decodeValues(encoded: string): TweakValues | null {
  try {
    return JSON.parse(fromBase64Url(encoded)) as TweakValues;
  } catch {
    return null;
  }
}

export function readUrlState(): { game?: string; region?: string; values?: TweakValues } {
  const params = new URLSearchParams(window.location.search);
  return {
    game: params.get('g') ?? undefined,
    region: params.get('r') ?? undefined,
    values: params.has('v') ? decodeValues(params.get('v')!) ?? undefined : undefined,
  };
}

export function writeUrlState(
  game: string,
  region: string | undefined,
  defaults: TweakValues,
  values: TweakValues,
) {
  const diff: TweakValues = {};
  let hasChanges = false;
  for (const [k, v] of Object.entries(values)) {
    if (v !== defaults[k]) { diff[k] = v; hasChanges = true; }
  }

  const params = new URLSearchParams();
  params.set('g', game);
  if (region) params.set('r', region);
  if (hasChanges) params.set('v', encodeValues(diff));
  const url = `${window.location.pathname}?${params.toString()}`;
  window.history.replaceState(null, '', url);
}
