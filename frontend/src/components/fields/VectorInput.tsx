import type { ReactNode } from 'react';

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
  fontSize: '0.75rem',
  fontWeight: 500,
  letterSpacing: '0.02em',
  color: '#c0c4d8',
};

const bodyStyle: React.CSSProperties = {
  padding: '12px 16px 16px',
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
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
        onChange={e => onChange(parseFloat(e.target.value) || 0)}
      />
    </div>
  );
}

export function VectorInput({
  label, helpEl, min, max, step,
  x, y, z, onXChange, onYChange, onZChange,
}: VectorInputProps) {
  return (
    <div style={cardStyle}>
      <div style={headerStyle}>
        <span style={labelStyle}>{label}</span>
        {helpEl}
      </div>
      <div style={bodyStyle}>
        <AxisRow axis="X" value={x} min={min} max={max} step={step} onChange={onXChange} />
        <AxisRow axis="Y" value={y} min={min} max={max} step={step} onChange={onYChange} />
        <AxisRow axis="Z" value={z} min={min} max={max} step={step} onChange={onZChange} />
      </div>
    </div>
  );
}
