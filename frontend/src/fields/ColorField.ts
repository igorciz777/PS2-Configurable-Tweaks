import { FieldConfig, type ValueWrite, type PatchLine, type TweakValues, type FieldData } from './FieldConfig';

export class ColorField extends FieldConfig {
  readonly type = 'color';
  readonly id: string;
  readonly label: string;
  readonly tag: string;
  readonly comment: string;
  readonly author: string;
  readonly help: string;
  readonly default: string;
  readonly writes: ValueWrite[];

  constructor(data: FieldData) {
    super();
    this.id = data.id as string;
    this.label = data.label as string;
    this.tag = (data.tag as string) ?? '';
    this.comment = (data.comment as string) ?? '';
    this.author = (data.author as string) ?? '';
    this.help = (data.help as string) ?? '';
    this.default = (data.default as string) ?? '#ffffff';
    this.writes = data.writes as ValueWrite[];
  }

  getStateKeys(): string[] { return [this.id]; }

  getDefaults(): TweakValues {
    return { [this.id]: this.default };
  }

  generatePatches(values: TweakValues): PatchLine[] {
    const hexColor = (values[this.id] as string) ?? this.default;
    const rgb = hexColor.replace('#', '');
    const r = parseInt(rgb.substring(0, 2), 16);
    const g = parseInt(rgb.substring(2, 4), 16);
    const b = parseInt(rgb.substring(4, 6), 16);
    const combined = (r << 16) | (g << 8) | b;
    const fullHex = combined.toString(16).toUpperCase().padStart(8, '0');
    return this.writes.map(w => ({
      address: w.address,
      type: w.type,
      value: w.bits === 'lo' ? fullHex.substring(0, 4)
        : w.bits === 'hi' ? fullHex.substring(4, 8)
        : fullHex,
    }));
  }

  getColorValue(values: TweakValues): string {
    return (values[this.id] as string) ?? this.default;
  }
}
