interface PnachOutputProps {
  value: string;
}

export function PnachOutput({ value }: PnachOutputProps) {
  return (
    <div className="pnach-section">
      <h3 className="section-title">.pnach Preview</h3>
      <textarea className="pnach-output" readOnly value={value} />
    </div>
  );
}
