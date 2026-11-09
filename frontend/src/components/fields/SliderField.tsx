import type { ReactNode } from 'react';
import { RangeSlider } from '../RangeSlider';
import { FieldCard } from './FieldCard';

interface SliderFieldProps {
  label: string;
  helpEl?: ReactNode;
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (v: number) => void;
}

export function SliderField({ label, helpEl, min, max, step, value, onChange }: SliderFieldProps) {
  return (
    <FieldCard label={label} helpEl={helpEl}>
      <RangeSlider label={label} min={min} max={max} step={step} value={value} onChange={onChange} />
    </FieldCard>
  );
}
