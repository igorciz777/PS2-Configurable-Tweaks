import { type TextareaHTMLAttributes } from 'react';

interface PnachOutputProps {
  value: string;
}

const style: TextareaHTMLAttributes<HTMLTextAreaElement>['style'] = {
  background: '#060714',
  border: '1px solid rgba(80,90,160,0.12)',
  borderRadius: '8px',
  color: '#50b080',
  fontFamily: "'JetBrains Mono', monospace",
  fontSize: '0.75rem',
  lineHeight: 1.7,
  padding: '16px',
  resize: 'vertical',
  outline: 'none',
  width: '100%',
  minHeight: '300px',
  maxHeight: '500px',
  flex: 1,
  tabSize: 2,
};

export function PnachOutput({ value }: PnachOutputProps) {
  return (
    <textarea
      style={style}
      readOnly
      value={value}
      onFocus={e => { e.currentTarget.style.borderColor = 'rgba(74,125,255,0.4)'; }}
      onBlur={e => { e.currentTarget.style.borderColor = 'rgba(80,90,160,0.12)'; }}
    />
  );
}
