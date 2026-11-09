import type { CSSProperties, ReactNode } from 'react';
import { bodyStyle as defaultBodyStyle } from './fieldStyles';

const cardStyle: CSSProperties = {
  background: 'rgba(14,16,38,0.25)',
  border: '1px solid rgba(80,90,160,0.08)',
  borderRadius: '8px',
  overflow: 'hidden',
};

const headerStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  padding: '10px 16px',
};

const labelStyle: CSSProperties = {
  flex: 1,
  fontSize: '0.75rem',
  fontWeight: 500,
  letterSpacing: '0.02em',
  color: '#c0c4d8',
};

interface FieldCardProps {
  label: string;
  helpEl?: ReactNode;
  badge?: ReactNode;
  bodyStyle?: CSSProperties;
  children: ReactNode;
}

export function FieldCard({ label, helpEl, badge, bodyStyle: customBody, children }: FieldCardProps) {
  return (
    <div style={cardStyle}>
      <div style={headerStyle}>
        <span style={labelStyle}>{label}</span>
        {helpEl}
        {badge}
      </div>
      <div style={customBody ?? defaultBodyStyle}>{children}</div>
    </div>
  );
}
