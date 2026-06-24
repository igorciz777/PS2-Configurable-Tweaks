import type {
  GameConfig, TweakValues, TweakField,
  PercentField, RangeField, CheckboxField, DeadzoneField,
} from '../types/gameConfig';
import { floatToHex } from '../utils/hex';

interface Ctx {
  hex: (id: string) => string;
  hexLo: (id: string) => string;
  hexHi: (id: string) => string;
}

function buildCtx(values: TweakValues, computed: Record<string, number>): Ctx {
  const all = { ...values };
  for (const [k, v] of Object.entries(computed)) all[k] = v;
  const cache = new Map<string, string>();

  const getHex = (id: string): string => {
    const c = cache.get(id);
    if (c) return c;
    const v = all[id];
    if (typeof v !== 'number') return '00000000';
    const h = floatToHex(v, 0, 8);
    cache.set(id, h);
    return h;
  };

  return {
    hex: getHex,
    hexLo: (id) => getHex(id).substring(0, 4),
    hexHi: (id) => getHex(id).substring(4, 8),
  };
}

function resolve(tmpl: string, ctx: Ctx): string {
  return tmpl.replace(/\{\{(\w+)\}\}/g, (_, key: string) => {
    if (key.endsWith('_LO')) return ctx.hexLo(key.slice(0, -3));
    if (key.endsWith('_HI')) return ctx.hexHi(key.slice(0, -3));
    return ctx.hex(key);
  });
}

function line(p: { address: string; type: string; value: string }, ctx: Ctx): string {
  return `patch=0,EE,${p.address},${p.type},${resolve(p.value, ctx)}`;
}

function computedFor(field: TweakField, values: TweakValues): Record<string, number> {
  if (field.type !== 'deadzone') return {};
  const f = field as DeadzoneField;
  const a = f.axis;
  return {
    [`${a}MidMinusLow`]: ((values[`${a}Mid`] as number) ?? 0) - ((values[`${a}Low`] as number) ?? 0),
    [`${a}HighMinusMid`]: ((values[`${a}High`] as number) ?? 1) - ((values[`${a}Mid`] as number) ?? 0.5),
  };
}

function isActive(field: TweakField, values: TweakValues): boolean {
  if (field.type === 'checkbox') return values[field.id] === true;
  return true;
}

function getPatches(field: TweakField) {
  switch (field.type) {
    case 'percent': return (field as PercentField).patches;
    case 'range': return (field as RangeField).patches;
    case 'checkbox': return (field as CheckboxField).patches;
    case 'deadzone': return (field as DeadzoneField).patches;
    default: return [];
  }
}

export function generatePnach(config: GameConfig, values: TweakValues): string {
  const computed: Record<string, number> = {};
  for (const field of config.fields) Object.assign(computed, computedFor(field, values));
  const ctx = buildCtx(values, computed);
  const out: string[] = [];

  for (const field of config.fields) {
    if (!isActive(field, values)) continue;
    const patches = getPatches(field);
    if (patches.length === 0) continue;
    for (const p of patches) out.push(line(p, ctx));
  }

  return out.join('\n');
}
