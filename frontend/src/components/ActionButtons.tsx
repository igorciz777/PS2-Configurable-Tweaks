import { useCallback } from 'react';

interface ActionButtonsProps {
  pnachContent: string;
  filename: string;
  gameLabel: string;
  onReset: () => void;
}

export function ActionButtons({ pnachContent, filename, gameLabel, onReset }: ActionButtonsProps) {
  const handleDownload = useCallback(() => {
    const blob = new Blob([pnachContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename || `${gameLabel.replace(/\s+/g, '_')}.pnach`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [pnachContent, filename, gameLabel]);

  return (
    <div className="action-buttons">
      <button className="btn btn-primary" onClick={handleDownload}>Download .pnach</button>
      <button className="btn btn-secondary" onClick={onReset}>Reset</button>
    </div>
  );
}
