import type { TweakField, TweakValues, PercentField, RangeField, DeadzoneField, CheckboxField } from '../types/gameConfig';
import { PercentSlider } from './PercentSlider';
import { RangeSlider } from './RangeSlider';
import { DeadzoneGroup } from './DeadzoneGroup';

interface Props {
  field: TweakField;
  values: TweakValues;
  onSetValue: (key: string, val: number | boolean) => void;
  getPercent: (fieldId: string) => number;
  onUpdatePercent: (fieldId: string, pct: number) => void;
}

export function DynamicField({ field, values, onSetValue, getPercent, onUpdatePercent }: Props) {
  switch (field.type) {
    case 'percent': {
      const f = field as PercentField;
      const val = typeof values[f.id] === 'number' ? (values[f.id] as number) : parseFloat(f.range.value);
      return (
        <PercentSlider
          label={f.label}
          percent={getPercent(f.id)}
          gameValue={val}
          valueMin={f.range.min}
          valueMax={f.range.max}
          valueStep={f.range.step}
          onPercentChange={p => onUpdatePercent(f.id, p)}
          onGameValueChange={v => onSetValue(f.id, v)}
        />
      );
    }

    case 'range': {
      const f = field as RangeField;
      const val = typeof values[f.id] === 'number' ? (values[f.id] as number) : f.default;
      return (
        <RangeSlider
          label={f.label}
          min={f.min} max={f.max} step={f.step}
          value={val}
          onChange={v => onSetValue(f.id, v)}
        />
      );
    }

    case 'checkbox': {
      const f = field as CheckboxField;
      const checked = values[f.id] === true;
      return (
        <div className="checkbox-field">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={checked}
              onChange={() => onSetValue(f.id, !checked)}
            />
            <span>{f.label}</span>
          </label>
        </div>
      );
    }

    case 'deadzone': {
      const f = field as DeadzoneField;
      const a = f.axis;
      const low = typeof values[`${a}Low`] === 'number' ? (values[`${a}Low`] as number) : 0;
      const mid = typeof values[`${a}Mid`] === 'number' ? (values[`${a}Mid`] as number) : 0.5;
      const high = typeof values[`${a}High`] === 'number' ? (values[`${a}High`] as number) : 1;

      return (
        <DeadzoneGroup
          title={f.label}
          lowRange={f.lowRange}
          midRange={f.midRange}
          highRange={f.highRange}
          low={low} mid={mid} high={high}
          onLowChange={v => onSetValue(`${a}Low`, v)}
          onMidChange={v => onSetValue(`${a}Mid`, v)}
          onHighChange={v => onSetValue(`${a}High`, v)}
        />
      );
    }

    default:
      return null;
  }
}
