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

export function PercentSlider({
  label, helpEl, percent, gameValue, valueMin, valueMax, valueStep,
  onPercentChange, onGameValueChange,
}: PercentSliderProps) {
  return (
    <div className="field-card">
      <div className="field-card-header">
        <span className="field-label">{label}</span>
        {helpEl}
        <span className="field-percent">{Math.round(percent)}%</span>
      </div>
      <div className="field-body">
        <input
          type="range" className="custom-range"
          min={0} max={200} step={0.01}
          value={percent}
          onChange={e => onPercentChange(parseFloat(e.target.value))}
        />
        <input
          type="number" className="custom-number"
          min={valueMin} max={valueMax} step={valueStep}
          value={gameValue}
          onChange={e => onGameValueChange(parseFloat(e.target.value) || 0)}
        />
      </div>
    </div>
  );
}
