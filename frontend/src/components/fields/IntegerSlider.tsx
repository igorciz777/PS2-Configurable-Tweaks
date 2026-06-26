import type { ReactNode } from 'react';
import { RangeSlider } from '../RangeSlider';

interface IntegerSliderProps {
  label: string;
  helpEl?: ReactNode;
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (v: number) => void;
}

const cardStyle: React.CSSProperties = {
  background: 'rgba(14,16,38,0.25)',
  border: '1px solid rgba(80,90,160,0.08)',
  borderRadius: '8px',
  overflow: 'hidden',
};

const headerStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  padding: '10px 16px',
};

const labelStyle: React.CSSProperties = {
  flex: 1,
  fontSize: '0.65rem',
  fontWeight: 500,
  letterSpacing: '0.02em',
  color: '#c0c4d8',
};

const bodyStyle: React.CSSProperties = {
  padding: '12px 16px 16px',
};

export function IntegerSlider({ label, helpEl, min, max, step, value, onChange }: IntegerSliderProps) {
  return (
    <div style={cardStyle}>
      <div style={headerStyle}>
        <span style={labelStyle}>{label}</span>
        {helpEl}
      </div>
      <div style={bodyStyle}>
        <RangeSlider label={label} min={min} max={max} step={step} value={value} onChange={onChange} />
      </div>
    </div>
  );
}
