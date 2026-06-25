import { RangeSlider } from '../RangeSlider';

interface RangeDef {
  min: number;
  max: number;
  step: number;
  value: number;
}

interface DeadzoneGroupProps {
  title: string;
  low: RangeDef;
  mid: RangeDef;
  high: RangeDef;
  onLowChange: (v: number) => void;
  onMidChange: (v: number) => void;
  onHighChange: (v: number) => void;
}

export function DeadzoneGroup({
  title, low, mid, high,
  onLowChange, onMidChange, onHighChange,
}: DeadzoneGroupProps) {
  return (
    <div className="field-card">
      <div className="field-card-header">
        <span className="field-label">{title}</span>
      </div>
      <div className="field-body">
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
