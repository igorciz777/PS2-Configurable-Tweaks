import type { ReactNode } from 'react';

interface PercentSliderProps {
  label: string;
  helpEl?: ReactNode;
  percent: number;
  gameValue: number;
  valueMin: number;
  valueMax: number;
  valueStep: number;
  onPercentChange: (pct: number) => void;
  onGameValueChange: (val: number) => void;
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

const pctBadge: React.CSSProperties = {
  fontFamily: "'JetBrains Mono', monospace",
  fontSize: '0.55rem',
  color: '#4a7dff',
  background: 'rgba(74,125,255,0.08)',
  padding: '2px 10px',
  borderRadius: '4px',
};

const bodyStyle: React.CSSProperties = {
  padding: '12px 16px 16px',
};

export function PercentSlider({
  label, helpEl, percent, gameValue, valueMin, valueMax, valueStep,
  onPercentChange, onGameValueChange,
}: PercentSliderProps) {
  return (
    <div style={cardStyle}>
      <div style={headerStyle}>
        <span style={labelStyle}>{label}</span>
        {helpEl}
        <span style={pctBadge}>{Math.round(percent)}%</span>
      </div>
      <div style={bodyStyle}>
        <input
          type="range" className="psbbn-range"
          style={{ width: '100%', marginBottom: '10px' }}
          min={0} max={200} step={0.01}
          value={percent}
          onChange={e => onPercentChange(parseFloat(e.target.value))}
        />
        <input
          type="number" className="psbbn-input"
          style={{ width: '100%', padding: '8px 12px' }}
          min={valueMin} max={valueMax} step={valueStep}
          value={gameValue}
          onChange={e => onGameValueChange(parseFloat(e.target.value) || 0)}
        />
      </div>
    </div>
  );
}
