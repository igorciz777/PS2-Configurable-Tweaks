export interface PatchLine {
  address: string;
  type: 'word' | 'extended';
  value: string;
}

export interface ValueWrite {
  address: string;
  type: 'word' | 'extended';
  bits?: 'lo' | 'hi' | 'full';
  hex?: string;
  prefix?: string;
}

export interface WriteMap {
  low?: ValueWrite[];
  mid?: ValueWrite[];
  high?: ValueWrite[];
  midMinusLow?: ValueWrite[];
  highMinusMid?: ValueWrite[];
}

export interface FieldData {
  type: string;
  id: string;
  label: string;
  tag?: string;
  comment?: string;
  author?: string;
  [key: string]: unknown;
}

export type TweakValue = number | boolean | string;
export type TweakValues = Record<string, TweakValue>;

export abstract class FieldConfig {
  abstract readonly type: string;
  abstract readonly id: string;
  abstract readonly label: string;
  abstract readonly tag: string;
  abstract readonly comment: string;
  abstract readonly author: string;

  abstract getStateKeys(): string[];
  abstract getDefaults(): TweakValues;
  abstract generatePatches(values: TweakValues): PatchLine[];

  static registry: Record<string, new (data: FieldData) => FieldConfig> = {};

  static fromJSON(data: FieldData): FieldConfig {
    const cls = FieldConfig.registry[data.type];
    if (!cls) throw new Error(`Unknown field type: ${data.type}`);
    return new cls(data);
  }
}
