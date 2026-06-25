import { FieldConfig, type ValueWrite, type PatchLine, type TweakValues, type FieldData } from './FieldConfig';

export class IntegerField extends FieldConfig {
  readonly type = 'integer';
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
    this.step = (data.step as number) ?? 1;
    this.writes = data.writes as ValueWrite[];
  }

  getStateKeys(): string[] { return [this.id]; }

  getDefaults(): TweakValues {
    return { [this.id]: this.default };
  }

  generatePatches(values: TweakValues): PatchLine[] {
    const v = (values[this.id] as number) ?? this.default;
    return generateIntPatches(this.writes, v);
  }
}

function intToHex(v: number, bytes: 2 | 4): string {
  const hex = v.toString(16).toUpperCase().padStart(bytes * 2, '0');
  return hex;
}

export function generateIntPatches(writes: ValueWrite[], value: number): PatchLine[] {
  return writes.map(w => {
    if (w.hex) return { address: w.address, type: w.type, value: w.hex };
    const isWord = w.type === 'word' || w.bits === 'full';
    const fullHex = intToHex(value, isWord ? 4 : 2);
    let val: string;
    switch (w.bits) {
      case 'lo': val = fullHex.substring(0, 4); break;
      case 'hi': val = fullHex.substring(4, 8); break;
      case 'full':
      default: val = fullHex; break;
    }
    if (w.prefix) val = w.prefix + val;
    return { address: w.address, type: w.type, value: val };
  });
}
