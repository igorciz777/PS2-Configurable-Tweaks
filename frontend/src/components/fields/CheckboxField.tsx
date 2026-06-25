interface CheckboxFieldProps {
  label: string;
  checked: boolean;
  onChange: () => void;
}

export function CheckboxField({ label, checked, onChange }: CheckboxFieldProps) {
  return (
    <div className="field-card">
      <label className="checkbox-label">
        <input type="checkbox" checked={checked} onChange={onChange} />
        <span className="field-label">{label}</span>
      </label>
    </div>
  );
}
