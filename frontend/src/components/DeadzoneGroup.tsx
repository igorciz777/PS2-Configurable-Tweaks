import type { RangeConfig } from '../types/gameConfig';
import { RangeSlider } from './RangeSlider';

interface DeadzoneGroupProps {
  title: string;
  lowRange: RangeConfig;
  midRange: RangeConfig;
  highRange: RangeConfig;
  low: number;
  mid: number;
  high: number;
  onLowChange: (v: number) => void;
  onMidChange: (v: number) => void;
  onHighChange: (v: number) => void;
}

export function DeadzoneGroup({
  title, lowRange, midRange, highRange,
  low, mid, high,
  onLowChange, onMidChange, onHighChange,
}: DeadzoneGroupProps) {
  return (
    <div className="field-card">
      <div className="field-card-header">
        <span className="field-label">{title}</span>
      </div>
      <div className="field-body">
        <RangeSlider label="Low" min={lowRange.min} max={lowRange.max} step={lowRange.step}
          value={low} onChange={onLowChange} />
        <RangeSlider label="Mid" min={midRange.min} max={midRange.max} step={midRange.step}
          value={mid} onChange={onMidChange} />
        <RangeSlider label="High" min={highRange.min} max={highRange.max} step={highRange.step}
          value={high} onChange={onHighChange} />
      </div>
    </div>
  );
}
