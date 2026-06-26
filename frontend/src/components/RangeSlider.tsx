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
    <div style={{ marginBottom: '12px' }}>
      <span
        style={{
          display: 'block',
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: '0.6rem',
          color: '#6a6e94',
          marginBottom: '8px',
          letterSpacing: '0.05em',
          textTransform: 'uppercase',
        }}
      >
        {label}
      </span>
      <div className="flex items-center gap-3">
        <input
          type="range" className="psbbn-range flex-1"
          min={min} max={max} step={step}
          value={value}
          onChange={e => onChange(parseFloat(e.target.value))}
        />
        <input
          type="number" className="psbbn-input"
          style={{ width: '80px', padding: '6px 10px', textAlign: 'center' }}
          min={min} max={max} step={step}
          value={value}
          onChange={e => onChange(parseFloat(e.target.value) || 0)}
        />
      </div>
    </div>
  );
}
