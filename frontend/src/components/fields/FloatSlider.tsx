import type { ReactNode } from 'react';
import { RangeSlider } from '../RangeSlider';

interface FloatSliderProps {
  label: string;
  helpEl?: ReactNode;
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (v: number) => void;
}

export function FloatSlider({ label, helpEl, min, max, step, value, onChange }: FloatSliderProps) {
  return (
    <div className="field-card">
      <div className="field-card-header">
        <span className="field-label">{label}</span>
        {helpEl}
      </div>
      <div className="field-body">
        <RangeSlider label={label} min={min} max={max} step={step} value={value} onChange={onChange} />
      </div>
    </div>
  );
}
