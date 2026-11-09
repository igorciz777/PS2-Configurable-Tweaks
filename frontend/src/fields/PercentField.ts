import { FieldConfig, type ValueWrite, type PatchLine, type TweakValues, type FieldData } from './FieldConfig';
import { resolveAddress, resolveHex } from './regionResolver';

export function floatToHex(floatValue: number): string {
  const buffer = new ArrayBuffer(4);
  const view = new DataView(buffer);
  view.setFloat32(0, floatValue, false);
  const hex = view.getUint32(0).toString(16).toUpperCase();
  return hex === '0' ? '00000000' : hex;
}

export function sliceHex(fullHex: string, bits?: 'lo' | 'hi' | 'full'): string {
  switch (bits) {
    case 'lo': return fullHex.substring(0, 4);
    case 'hi': return fullHex.substring(4, 8);
    case 'full':
    default: return fullHex;
  }
}

export function generateValuePatches(writes: ValueWrite[], value: number, region?: string): PatchLine[] {
  const fullHex = floatToHex(value);
  return writes.map(w => {
    const addr = resolveAddress(w.address, region);
    if (w.hex) return { address: addr, type: w.type, value: resolveHex(w.hex, region) };
    let val = sliceHex(fullHex, w.bits);
    if (w.prefix) val = w.prefix + val;
    return { address: addr, type: w.type, value: val };
  });
}

export class PercentField extends FieldConfig {
  readonly type = 'percent';
  readonly id: string;
  readonly label: string;
  readonly tag: string;
  readonly comment: string;
  readonly author: string;
  readonly help: string;
  readonly min: number;
  readonly max: number;
  readonly default: number;
  readonly step: number;
  readonly isInverse: boolean;
  readonly writes: ValueWrite[];

  constructor(data: FieldData) {
    super();
    this.id = data.id as string;
    this.label = data.label as string;
    this.tag = (data.tag as string) ?? '';
    this.comment = (data.comment as string) ?? '';
    this.author = (data.author as string) ?? '';
    this.help = (data.help as string) ?? '';
    this.min = data.min as number;
    this.max = data.max as number;
    this.default = data.default as number;
    this.step = (data.step as number) ?? 0.01;
    this.isInverse = (data.isInverse as boolean) ?? false;
    this.writes = data.writes as ValueWrite[];
  }

  getDefaults(): TweakValues {
    return { [this.id]: this.default };
  }

  generatePatches(values: TweakValues, _activeCamera?: string, region?: string): PatchLine[] {
    return generateValuePatches(this.writes, values[this.id] as number, region);
  }
}
