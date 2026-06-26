import type { ReactNode } from 'react';

interface ColorPickerFieldProps {
  label: string;
  helpEl?: ReactNode;
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
  fontSize: '0.65rem',
  fontWeight: 500,
  letterSpacing: '0.02em',
  color: '#c0c4d8',
};

const bodyStyle: React.CSSProperties = {
  padding: '12px 16px 16px',
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
};

export function ColorPickerField({ label, helpEl, value, onChange }: ColorPickerFieldProps) {
  return (
    <div style={cardStyle}>
      <div style={headerStyle}>
        <span style={labelStyle}>{label}</span>
        {helpEl}
      </div>
      <div style={bodyStyle}>
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
      </div>
    </div>
  );
}
