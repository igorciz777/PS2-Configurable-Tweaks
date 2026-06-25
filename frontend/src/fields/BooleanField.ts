import { FieldConfig, type ValueWrite, type PatchLine, type TweakValues, type FieldData } from './FieldConfig';

export class BooleanField extends FieldConfig {
  readonly type = 'boolean';
  readonly id: string;
  readonly label: string;
  readonly tag: string;
  readonly comment: string;
  readonly author: string;
  readonly help: string;
  readonly default: boolean;
  readonly onWrites: ValueWrite[];
  readonly offWrites: ValueWrite[];

  constructor(data: FieldData) {
    super();
    this.id = data.id as string;
    this.label = data.label as string;
    this.tag = (data.tag as string) ?? '';
    this.comment = (data.comment as string) ?? '';
    this.author = (data.author as string) ?? '';
    this.help = (data.help as string) ?? '';
    this.default = (data.default as boolean) ?? false;
    this.onWrites = (data.onWrites as ValueWrite[]) ?? [];
    this.offWrites = (data.offWrites as ValueWrite[]) ?? [];
  }

  getStateKeys(): string[] {
    return [this.id];
  }

  getDefaults(): TweakValues {
    return { [this.id]: this.default };
  }

  generatePatches(values: TweakValues): PatchLine[] {
    const active = values[this.id] === true;
    const writes = active ? this.onWrites : this.offWrites;
    return writes.map(w => ({
      address: w.address,
      type: w.type,
      value: w.hex ?? '00000000',
    }));
  }
}
