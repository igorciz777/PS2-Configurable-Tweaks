import type { ReactNode } from 'react';
import type { DropdownOption } from '../../fields/DropdownField';

interface DropdownSelectProps {
  label: string;
  helpEl?: ReactNode;
  options: DropdownOption[];
  value: string;
  onChange: (v: string) => void;
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
  fontSize: '0.75rem',
  fontWeight: 500,
  letterSpacing: '0.02em',
  color: '#c0c4d8',
};

const bodyStyle: React.CSSProperties = {
  padding: '8px 16px 16px',
};

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
    <div style={cardStyle}>
      <div style={headerStyle}>
        <span style={labelStyle}>{label}</span>
        {helpEl}
      </div>
      <div style={bodyStyle}>
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
      </div>
    </div>
  );
}
