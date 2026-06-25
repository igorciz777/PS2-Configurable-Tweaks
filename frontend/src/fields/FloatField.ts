import { FieldConfig, type ValueWrite, type PatchLine, type TweakValues, type FieldData } from './FieldConfig';
import { generateValuePatches } from './PercentField';

export class FloatField extends FieldConfig {
  readonly type = 'float';
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
    this.step = (data.step as number) ?? 0.01;
    this.writes = data.writes as ValueWrite[];
  }

  getStateKeys(): string[] { return [this.id]; }

  getDefaults(): TweakValues {
    return { [this.id]: this.default };
  }

  generatePatches(values: TweakValues): PatchLine[] {
    return generateValuePatches(this.writes, values[this.id] as number ?? this.default);
  }
}
