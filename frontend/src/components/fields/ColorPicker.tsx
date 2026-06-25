import type { ReactNode } from 'react';

interface ColorPickerFieldProps {
  label: string;
  helpEl?: ReactNode;
  value: string;
  onChange: (v: string) => void;
}

export function ColorPickerField({ label, helpEl, value, onChange }: ColorPickerFieldProps) {
  return (
    <div className="field-card">
      <div className="field-card-header">
        <span className="field-label">{label}</span>
        {helpEl}
      </div>
      <div className="field-body color-picker-body">
        <input
          type="color"
          value={value}
          onChange={e => onChange(e.target.value)}
          className="color-picker-input"
        />
        <input
          type="text"
          value={value}
          onChange={e => onChange(e.target.value)}
          className="color-hex-input"
          maxLength={7}
          placeholder="#ffffff"
        />
      </div>
    </div>
  );
}
