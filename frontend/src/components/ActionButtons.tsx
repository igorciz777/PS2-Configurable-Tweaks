import { useCallback } from 'react';

interface ActionButtonsProps {
  pnachContent: string;
  filename: string;
  gameLabel: string;
  onReset: () => void;
}

const btnPrimary = {
  background: '#4a7dff',
  color: '#fff',
  padding: '12px 32px',
  borderRadius: '8px',
  fontSize: '0.875rem',
  fontWeight: 500,
  border: 'none',
  cursor: 'pointer',
  transition: 'background 0.15s',
};

const btnSecondary = {
  background: 'rgba(14,16,38,0.6)',
  color: '#c0c4d8',
  padding: '12px 32px',
  borderRadius: '8px',
  fontSize: '0.875rem',
  fontWeight: 500,
  border: '1px solid rgba(80,90,160,0.15)',
  cursor: 'pointer',
  transition: 'background 0.15s, border-color 0.15s',
};

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
    <div className="flex gap-4 flex-wrap">
      <button
        style={btnPrimary}
        onMouseEnter={e => { e.currentTarget.style.background = '#5a8dff'; }}
        onMouseLeave={e => { e.currentTarget.style.background = '#4a7dff'; }}
        onMouseDown={e => { e.currentTarget.style.background = '#3a6def'; }}
        onMouseUp={e => { e.currentTarget.style.background = '#5a8dff'; }}
        onClick={handleDownload}
      >
        Download .pnach
      </button>
      <button
        style={btnSecondary}
        onMouseEnter={e => {
          e.currentTarget.style.background = 'rgba(14,16,38,0.8)';
          e.currentTarget.style.borderColor = 'rgba(80,90,160,0.3)';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.background = 'rgba(14,16,38,0.6)';
          e.currentTarget.style.borderColor = 'rgba(80,90,160,0.15)';
        }}
        onClick={onReset}
      >
        Reset
      </button>
    </div>
  );
}
