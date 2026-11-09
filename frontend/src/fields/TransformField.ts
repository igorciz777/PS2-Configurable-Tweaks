import {
  FieldConfig,
  type PatchLine,
  type TweakValues,
  type FieldData,
  type AddressMap,
} from './FieldConfig';
import { floatToHex, sliceHex } from './PercentField';
import { resolveAddress } from './regionResolver';

export interface TransformAxisWrite {
  address: string | AddressMap;
  type: 'word' | 'extended';
  bits?: 'lo' | 'hi' | 'full';
}

export interface TransformWrites {
  x: TransformAxisWrite;
  y: TransformAxisWrite;
  z: TransformAxisWrite;
}

export class TransformField extends FieldConfig {
  readonly type = 'transform';
  readonly id: string;
  readonly label: string;
  readonly tag: string;
  readonly comment: string;
  readonly author: string;
  readonly help: string;
  readonly min: number;
  readonly max: number;
  readonly default: [number, number, number];
  readonly step: number;
  readonly writes: TransformWrites;
  readonly cameraWrites?: Record<string, TransformWrites>;

  constructor(data: FieldData) {
    super();
    this.id = data.id as string;
    this.label = data.label as string;
    this.tag = (data.tag as string) ?? '';
    this.comment = (data.comment as string) ?? '';
    this.author = (data.author as string) ?? '';
    this.help = (data.help as string) ?? '';
    this.min = (data.min as number) ?? -100;
    this.max = (data.max as number) ?? 100;
    this.default = (data.default as [number, number, number]) ?? [0, 0, 0];
    this.step = (data.step as number) ?? 0.01;
    this.writes = data.writes as TransformWrites;
    this.cameraWrites = data.cameraWrites as Record<string, TransformWrites> | undefined;
  }

  getDefaults(): TweakValues {
    const defaults: TweakValues = {
      [`${this.id}X`]: this.default[0],
      [`${this.id}Y`]: this.default[1],
      [`${this.id}Z`]: this.default[2],
    };
    if (this.cameraWrites) {
      for (const cam of Object.keys(this.cameraWrites)) {
        defaults[`${cam}${this.id}X`] = this.default[0];
        defaults[`${cam}${this.id}Y`] = this.default[1];
        defaults[`${cam}${this.id}Z`] = this.default[2];
      }
    }
    return defaults;
  }

  generatePatches(values: TweakValues, _activeCamera?: string, region?: string): PatchLine[] {
    const axes = ['x', 'y', 'z'] as const;
    const suffixes = ['X', 'Y', 'Z'] as const;

    const patches: PatchLine[] = [];

    for (let i = 0; i < axes.length; i++) {
      const axis = axes[i];
      const stateKey = `${this.id}${suffixes[i]}`;
      const write = this.writes[axis];
      const value = (values[stateKey] as number) ?? this.default[i];
      const hex = floatToHex(value);
      const val = sliceHex(hex, write.bits);
      patches.push({ address: resolveAddress(write.address, region), type: write.type, value: val });
    }

    return patches;
  }
}
