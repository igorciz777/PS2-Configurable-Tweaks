export interface PatchLine {
  address: string;
  type: 'word' | 'extended';
  value: string;
}

export interface RangeConfig {
  min: number;
  max: number;
  step: number;
  value: string;
  isInverse: boolean;
}

export interface BaseField {
  id: string;
  label: string;
}

export interface PercentField extends BaseField {
  type: 'percent';
  range: RangeConfig;
  patches: PatchLine[];
}

export interface RangeField extends BaseField {
  type: 'range';
  min: number;
  max: number;
  step: number;
  default: number;
  patches: PatchLine[];
}

export interface CheckboxField extends BaseField {
  type: 'checkbox';
  default: boolean;
  patches: PatchLine[];
}

export interface DeadzoneField extends BaseField {
  type: 'deadzone';
  axis: string;
  lowRange: RangeConfig;
  midRange: RangeConfig;
  highRange: RangeConfig;
  patches: PatchLine[];
}

export type TweakField = PercentField | RangeField | CheckboxField | DeadzoneField;

export interface GameConfig {
  id: string;
  label: string;
  filename: string;
  group: string;
  fields: TweakField[];
}

export type TweakValue = number | boolean;
export type TweakValues = Record<string, TweakValue>;
