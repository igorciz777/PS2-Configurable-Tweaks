import type { ReactNode } from 'react';
import { RangeSlider } from '../RangeSlider';

interface RangeDef {
  min: number;
  max: number;
  step: number;
  value: number;
}

interface DeadzoneGroupProps {
  title: string;
  helpEl?: ReactNode;
  low: RangeDef;
  mid: RangeDef;
  high: RangeDef;
  onLowChange: (v: number) => void;
  onMidChange: (v: number) => void;
  onHighChange: (v: number) => void;
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

export function DeadzoneGroup({
  title, helpEl, low, mid, high,
  onLowChange, onMidChange, onHighChange,
}: DeadzoneGroupProps) {
  return (
    <div style={cardStyle}>
      <div style={headerStyle}>
        <span style={labelStyle}>{title}</span>
        {helpEl}
      </div>
      <div style={bodyStyle}>
        <RangeSlider label="Low" min={low.min} max={low.max} step={low.step}
          value={low.value} onChange={onLowChange} />
        <RangeSlider label="Mid" min={mid.min} max={mid.max} step={mid.step}
          value={mid.value} onChange={onMidChange} />
        <RangeSlider label="High" min={high.min} max={high.max} step={high.step}
          value={high.value} onChange={onHighChange} />
      </div>
    </div>
  );
}
