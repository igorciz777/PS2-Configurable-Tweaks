import type { ReactNode } from 'react';
import { FieldCard } from './FieldCard';
import { bodyStyle } from './fieldStyles';

interface VectorInputProps {
  label: string;
  helpEl?: ReactNode;
  min: number;
  max: number;
  step: number;
  x: number;
  y: number;
  z: number;
  onXChange: (v: number) => void;
  onYChange: (v: number) => void;
  onZChange: (v: number) => void;
}

const AXIS_COLORS: Record<string, string> = {
  X: '#e06060',
  Y: '#40c080',
  Z: '#4a7dff',
};

const axisRowStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
};

function axisLabelStyle(axis: string): React.CSSProperties {
  return {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '0.6rem',
    fontWeight: 600,
    letterSpacing: '0.08em',
    color: AXIS_COLORS[axis] ?? '#6a6e94',
    width: '12px',
    textAlign: 'center',
    flexShrink: 0,
  };
}

function AxisRow({
  axis,
  value,
  min,
  max,
  step,
  onChange,
}: {
  axis: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
}) {
  return (
    <div style={axisRowStyle}>
      <span style={axisLabelStyle(axis)}>{axis}</span>
      <input
        type="range"
        className="psbbn-range flex-1 min-w-0"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={e => onChange(parseFloat(e.target.value))}
      />
      <input
        type="number"
        className="psbbn-input shrink-0"
        style={{ width: '72px', padding: '4px 6px', textAlign: 'center' }}
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={e => {
          const v = parseFloat(e.target.value) || 0;
          onChange(Math.min(Math.max(v, min), max));
        }}
      />
    </div>
  );
}

export function VectorInput({
  label, helpEl, min, max, step,
  x, y, z, onXChange, onYChange, onZChange,
}: VectorInputProps) {
  return (
    <FieldCard
      label={label}
      helpEl={helpEl}
      bodyStyle={{ ...bodyStyle, display: 'flex', flexDirection: 'column', gap: '8px' }}
    >
      <AxisRow axis="X" value={x} min={min} max={max} step={step} onChange={onXChange} />
      <AxisRow axis="Y" value={y} min={min} max={max} step={step} onChange={onYChange} />
      <AxisRow axis="Z" value={z} min={min} max={max} step={step} onChange={onZChange} />
    </FieldCard>
  );
}
