import { FieldConfig, type ValueWrite, type PatchLine, type TweakValues, type FieldData } from './FieldConfig';
import { resolveAddress } from './regionResolver';

export interface DropdownOption {
  value: string;
  label: string;
}

export class DropdownField extends FieldConfig {
  readonly type = 'dropdown';
  readonly id: string;
  readonly label: string;
  readonly tag: string;
  readonly comment: string;
  readonly author: string;
  readonly help: string;
  readonly default: string;
  readonly options: DropdownOption[];
  readonly writes: Record<string, ValueWrite[]>;
  readonly patchIfNotDefault: boolean;

  constructor(data: FieldData) {
    super();
    this.id = data.id as string;
    this.label = data.label as string;
    this.tag = (data.tag as string) ?? '';
    this.comment = (data.comment as string) ?? '';
    this.author = (data.author as string) ?? '';
    this.help = (data.help as string) ?? '';
    this.default = (data.default as string) ?? '';
    this.options = (data.options as DropdownOption[]) ?? [];
    this.writes = (data.writes as Record<string, ValueWrite[]>) ?? {};
    this.patchIfNotDefault = (data.patchIfNotDefault as boolean) ?? false;
  }

  getStateKeys(): string[] {
    return [this.id];
  }

  getDefaults(): TweakValues {
    return { [this.id]: this.default };
  }

  generatePatches(values: TweakValues, _activeCamera?: string, region?: string): PatchLine[] {
    const selected = (values[this.id] as string) ?? this.default;
    if (!this.patchIfNotDefault && selected === this.default) return [];
    const optionWrites = this.writes[selected];
    if (!optionWrites) return [];
    return optionWrites.map(w => ({
      address: resolveAddress(w.address, region),
      type: w.type,
      value: w.hex ?? '00000000',
    }));
  }
}
