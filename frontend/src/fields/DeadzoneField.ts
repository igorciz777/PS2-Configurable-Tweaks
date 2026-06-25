import { FieldConfig, type PatchLine, type TweakValues, type FieldData, type ValueWrite } from './FieldConfig';
import { generateValuePatches } from './PercentField';

interface RangeDef {
  min: number;
  max: number;
  default: number;
  step: number;
}

export class DeadzoneField extends FieldConfig {
  readonly type = 'deadzone';
  readonly id: string;
  readonly label: string;
  readonly tag: string;
  readonly comment: string;
  readonly author: string;
  readonly axis: string;
  readonly ranges: { low: RangeDef; mid: RangeDef; high: RangeDef };
  readonly writes: {
    low?: ValueWrite[];
    mid?: ValueWrite[];
    high?: ValueWrite[];
    midMinusLow?: ValueWrite[];
    highMinusMid?: ValueWrite[];
  };
  readonly patches: ValueWrite[];

  constructor(data: FieldData) {
    super();
    this.id = data.id as string;
    this.label = data.label as string;
    this.tag = (data.tag as string) ?? '';
    this.comment = (data.comment as string) ?? '';
    this.author = (data.author as string) ?? '';
    this.axis = data.axis as string;
    this.ranges = data.ranges as { low: RangeDef; mid: RangeDef; high: RangeDef };
    this.writes = (data.writes as DeadzoneField['writes']) ?? {};
    this.patches = (data.patches as ValueWrite[]) ?? [];
  }

  getStateKeys(): string[] {
    return [`${this.axis}Low`, `${this.axis}Mid`, `${this.axis}High`];
  }

  getDefaults(): TweakValues {
    return {
      [`${this.axis}Low`]: this.ranges.low.default,
      [`${this.axis}Mid`]: this.ranges.mid.default,
      [`${this.axis}High`]: this.ranges.high.default,
    };
  }

  generatePatches(values: TweakValues): PatchLine[] {
    const low = (values[`${this.axis}Low`] as number) ?? 0;
    const mid = (values[`${this.axis}Mid`] as number) ?? 0.5;
    const high = (values[`${this.axis}High`] as number) ?? 1;
    const midMinusLow = mid - low;
    const highMinusMid = high - mid;
    const out: PatchLine[] = [];

    const emit = (writes: ValueWrite[] | undefined, val: number) => {
      if (writes) out.push(...generateValuePatches(writes, val));
    };

    emit(this.writes.low, low);
    emit(this.writes.mid, mid);
    emit(this.writes.high, high);
    emit(this.writes.midMinusLow, midMinusLow);
    emit(this.writes.highMinusMid, highMinusMid);

    for (const p of this.patches) {
      out.push({ address: p.address, type: p.type, value: p.hex ?? '00000000' });
    }

    return out;
  }
}
