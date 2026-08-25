import { FieldConfig, type ValueWrite, type PatchLine, type TweakValues, type FieldData } from './FieldConfig';
import { resolveAddress, resolveHex } from './regionResolver';

interface BooleanWrites {
  on: ValueWrite[];
  off: ValueWrite[];
}

export class BooleanField extends FieldConfig {
  readonly type = 'boolean';
  readonly id: string;
  readonly label: string;
  readonly tag: string;
  readonly comment: string;
  readonly author: string;
  readonly help: string;
  readonly default: boolean;
  readonly writes: BooleanWrites;

  constructor(data: FieldData) {
    super();
    this.id = data.id as string;
    this.label = data.label as string;
    this.tag = (data.tag as string) ?? '';
    this.comment = (data.comment as string) ?? '';
    this.author = (data.author as string) ?? '';
    this.help = (data.help as string) ?? '';
    this.default = (data.default as boolean) ?? false;
    const w = data.writes as BooleanWrites | undefined;
    this.writes = {
      on: w?.on ?? [],
      off: w?.off ?? [],
    };
  }

  getStateKeys(): string[] {
    return [this.id];
  }

  getDefaults(): TweakValues {
    return { [this.id]: this.default };
  }

  generatePatches(values: TweakValues, _activeCamera?: string, region?: string): PatchLine[] {
    const active = values[this.id] === true;
    const writes = active ? this.writes.on : this.writes.off;
    return writes.map(w => ({
      address: resolveAddress(w.address, region),
      type: w.type,
      value: resolveHex(w.hex, region),
    }));
  }
}
