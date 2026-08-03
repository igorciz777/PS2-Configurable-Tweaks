import type { FieldConfig, TweakValues, TweakValue } from '../../fields';
import { PercentField, BooleanField, DeadzoneField, FloatField, IntegerField, ColorField, DropdownField, TransformField } from '../../fields';
import { PercentSlider } from './PercentSlider';
import { CheckboxField } from './CheckboxField';
import { DeadzoneGroup } from './DeadzoneGroup';
import { FloatSlider } from './FloatSlider';
import { IntegerSlider } from './IntegerSlider';
import { ColorPickerField } from './ColorPicker';
import { DropdownSelect } from './DropdownSelect';
import { TransformFieldCard } from './TransformFieldCard';
import { HelpIcon, HelpTooltip } from '../HelpTooltip';

interface FieldRendererProps {
  field: FieldConfig;
  values: TweakValues;
  onSetValue: (key: string, value: TweakValue) => void;
  getPercent: (fieldId: string) => number;
  onUpdatePercent: (fieldId: string, pct: number) => void;
}

export function FieldRenderer({ field, values, onSetValue, getPercent, onUpdatePercent }: FieldRendererProps) {
  const helpEl = field.help ? (
    <>
      <HelpIcon id={field.id} />
      <HelpTooltip id={field.id} help={field.help} />
    </>
  ) : null;

  switch (field.type) {
    case 'percent': {
      const f = field as PercentField;
      const val = typeof values[f.id] === 'number' ? (values[f.id] as number) : f.default;
      return (
        <PercentSlider
          label={f.label}
          helpEl={helpEl}
          percent={getPercent(f.id)}
          gameValue={val}
          valueMin={f.min}
          valueMax={f.max}
          valueStep={f.step}
          onPercentChange={p => onUpdatePercent(f.id, p)}
          onGameValueChange={v => onSetValue(f.id, v)}
        />
      );
    }

    case 'boolean': {
      const f = field as BooleanField;
      const checked = values[f.id] === true;
      return (
        <CheckboxField
          label={f.label}
          helpEl={helpEl}
          checked={checked}
          onChange={() => onSetValue(f.id, !checked)}
        />
      );
    }

    case 'deadzone': {
      const f = field as DeadzoneField;
      const a = f.axis;
      const low = typeof values[`${a}Low`] === 'number' ? (values[`${a}Low`] as number) : f.ranges.low.default;
      const mid = typeof values[`${a}Mid`] === 'number' ? (values[`${a}Mid`] as number) : f.ranges.mid.default;
      const high = typeof values[`${a}High`] === 'number' ? (values[`${a}High`] as number) : f.ranges.high.default;
      return (
        <DeadzoneGroup
          title={f.label}
          helpEl={helpEl}
          low={{ min: f.ranges.low.min, max: f.ranges.low.max, step: f.ranges.low.step, value: low }}
          mid={{ min: f.ranges.mid.min, max: f.ranges.mid.max, step: f.ranges.mid.step, value: mid }}
          high={{ min: f.ranges.high.min, max: f.ranges.high.max, step: f.ranges.high.step, value: high }}
          onLowChange={v => onSetValue(`${a}Low`, v)}
          onMidChange={v => onSetValue(`${a}Mid`, v)}
          onHighChange={v => onSetValue(`${a}High`, v)}
        />
      );
    }

    case 'float': {
      const f = field as FloatField;
      const val = typeof values[f.id] === 'number' ? (values[f.id] as number) : f.default;
      return (
        <FloatSlider
          label={f.label}
          helpEl={helpEl}
          min={f.min} max={f.max} step={f.step}
          value={val}
          onChange={v => onSetValue(f.id, v)}
        />
      );
    }

    case 'integer': {
      const f = field as IntegerField;
      const val = typeof values[f.id] === 'number' ? (values[f.id] as number) : f.default;
      return (
        <IntegerSlider
          label={f.label}
          helpEl={helpEl}
          min={f.min} max={f.max} step={f.step}
          value={val}
          onChange={v => onSetValue(f.id, v)}
        />
      );
    }

    case 'color': {
      const f = field as ColorField;
      return (
        <ColorPickerField
          label={f.label}
          helpEl={helpEl}
          value={f.getColorValue(values)}
          onChange={v => onSetValue(f.id, v)}
        />
      );
    }

    case 'dropdown': {
      const f = field as DropdownField;
      const val = (values[f.id] as string) ?? f.default;
      return (
        <DropdownSelect
          label={f.label}
          helpEl={helpEl}
          options={f.options}
          value={val}
          onChange={v => onSetValue(f.id, v)}
        />
      );
    }

    case 'transform': {
      const f = field as TransformField;
      const xKey = `${f.id}X`;
      const yKey = `${f.id}Y`;
      const zKey = `${f.id}Z`;
      const xVal = typeof values[xKey] === 'number' ? (values[xKey] as number) : f.default[0];
      const yVal = typeof values[yKey] === 'number' ? (values[yKey] as number) : f.default[1];
      const zVal = typeof values[zKey] === 'number' ? (values[zKey] as number) : f.default[2];
      return (
        <TransformFieldCard
          label={f.label}
          helpEl={helpEl}
          min={f.min}
          max={f.max}
          step={f.step}
          x={xVal}
          y={yVal}
          z={zVal}
          onXChange={v => onSetValue(xKey, v)}
          onYChange={v => onSetValue(yKey, v)}
          onZChange={v => onSetValue(zKey, v)}
        />
      );
    }

    default:
      return null;
  }
}
