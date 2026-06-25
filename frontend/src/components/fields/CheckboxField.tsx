import type { ReactNode } from 'react';

interface CheckboxFieldProps {
  label: string;
  helpEl?: ReactNode;
  checked: boolean;
  onChange: () => void;
}

export function CheckboxField({ label, helpEl, checked, onChange }: CheckboxFieldProps) {
  return (
    <div className="field-card">
      <label className="checkbox-label">
        <input type="checkbox" checked={checked} onChange={onChange} />
        {helpEl}
        <span className="field-label">{label}</span>
      </label>
    </div>
  );
}
