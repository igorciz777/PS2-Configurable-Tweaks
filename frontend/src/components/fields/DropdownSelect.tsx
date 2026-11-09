import type { ReactNode } from 'react';
import type { DropdownOption } from '../../fields/DropdownField';
import { FieldCard } from './FieldCard';
import { bodyStyle } from './fieldStyles';

interface DropdownSelectProps {
  label: string;
  helpEl?: ReactNode;
  options: DropdownOption[];
  value: string;
  onChange: (v: string) => void;
}

const selectStyle: React.CSSProperties = {
  width: '100%',
  background: 'rgba(8, 9, 24, 0.6)',
  border: '1px solid rgba(80, 90, 160, 0.15)',
  borderRadius: '6px',
  color: '#c0c4d8',
  fontFamily: "'JetBrains Mono', monospace",
  fontSize: '0.8rem',
  padding: '8px 12px',
  outline: 'none',
  cursor: 'pointer',
  transition: 'border-color 0.15s',
};

export function DropdownSelect({ label, helpEl, options, value, onChange }: DropdownSelectProps) {
  return (
    <FieldCard label={label} helpEl={helpEl} bodyStyle={{ ...bodyStyle, padding: '8px 16px 16px' }}>
      <select
        style={selectStyle}
        value={value}
        onChange={e => onChange(e.target.value)}
        onFocus={e => { e.target.style.borderColor = 'rgba(74,125,255,0.5)'; }}
        onBlur={e => { e.target.style.borderColor = 'rgba(80,90,160,0.15)'; }}
      >
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </FieldCard>
  );
}
