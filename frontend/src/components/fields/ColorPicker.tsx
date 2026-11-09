import type { ReactNode } from 'react';
import { FieldCard } from './FieldCard';
import { bodyStyle } from './fieldStyles';

interface ColorPickerFieldProps {
  label: string;
  helpEl?: ReactNode;
  value: string;
  onChange: (v: string) => void;
}

export function ColorPickerField({ label, helpEl, value, onChange }: ColorPickerFieldProps) {
  return (
    <FieldCard
      label={label}
      helpEl={helpEl}
      bodyStyle={{ ...bodyStyle, display: 'flex', alignItems: 'center', gap: '12px' }}
    >
      <input
        type="color"
        value={value}
        onChange={e => onChange(e.target.value)}
        className="psbbn-color-swatch"
      />
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        className="psbbn-input"
        style={{ flex: 1, padding: '8px 12px' }}
        maxLength={7}
        placeholder="#ffffff"
      />
    </FieldCard>
  );
}
