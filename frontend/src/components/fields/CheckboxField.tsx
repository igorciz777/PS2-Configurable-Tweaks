import type { ReactNode } from 'react';

interface CheckboxFieldProps {
  label: string;
  helpEl?: ReactNode;
  checked: boolean;
  onChange: () => void;
}

const cardStyle: React.CSSProperties = {
  background: 'rgba(14,16,38,0.25)',
  border: '1px solid rgba(80,90,160,0.08)',
  borderRadius: '8px',
};

const checkboxBase: React.CSSProperties = {
  width: '16px',
  height: '16px',
  borderRadius: '4px',
  border: '1px solid',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '0.45rem',
  fontWeight: 700,
  transition: 'all 0.1s',
  flexShrink: 0,
};

export function CheckboxField({ label, helpEl, checked, onChange }: CheckboxFieldProps) {
  return (
    <div style={cardStyle}>
      <label
        className="flex items-center gap-3 cursor-pointer select-none"
        style={{ padding: '14px 16px' }}
      >
        <input type="checkbox" checked={checked} onChange={onChange} className="hidden" />
        <span
          style={{
            ...checkboxBase,
            background: checked ? 'rgba(74,125,255,0.15)' : 'rgba(8,9,24,0.6)',
            borderColor: checked ? '#4a7dff' : 'rgba(80,90,160,0.2)',
            color: checked ? '#4a7dff' : 'transparent',
          }}
        >
          {checked ? '✓' : ''}
        </span>
        {helpEl}
        <span
          style={{
            flex: 1,
            fontSize: '0.65rem',
            fontWeight: 500,
            letterSpacing: '0.02em',
            color: '#c0c4d8',
          }}
        >
          {label}
        </span>
      </label>
    </div>
  );
}
