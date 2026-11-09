import type { ReactNode } from 'react';
import { FieldCard } from './FieldCard';

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

const pctBadge: React.CSSProperties = {
  fontFamily: "'JetBrains Mono', monospace",
  fontSize: '0.55rem',
  color: '#4a7dff',
  background: 'rgba(74,125,255,0.08)',
  padding: '2px 10px',
  borderRadius: '4px',
};

export function PercentSlider({
  label, helpEl, percent, gameValue, valueMin, valueMax, valueStep,
  onPercentChange, onGameValueChange,
}: PercentSliderProps) {
  return (
    <FieldCard
      label={label}
      helpEl={helpEl}
      badge={<span style={pctBadge}>{Math.round(percent)}%</span>}
    >
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
        onChange={e => {
          const v = parseFloat(e.target.value) || 0;
          onGameValueChange(Math.min(Math.max(v, valueMin), valueMax));
        }}
      />
    </FieldCard>
  );
}
