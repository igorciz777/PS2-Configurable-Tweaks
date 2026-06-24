interface RangeSliderProps {
  label: string;
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (val: number) => void;
}

export function RangeSlider({
  label, min, max, step, value, onChange,
}: RangeSliderProps) {
  return (
    <div className="range-slider">
      <span className="range-label">{label}</span>
      <input
        type="range" className="custom-range"
        min={min} max={max} step={step}
        value={value}
        onChange={e => onChange(parseFloat(e.target.value))}
      />
      <input
        type="number" className="custom-number-sm"
        min={min} max={max} step={step}
        value={value}
        onChange={e => onChange(parseFloat(e.target.value) || 0)}
      />
    </div>
  );
}
