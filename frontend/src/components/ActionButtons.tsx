import { useCallback, useState } from 'react';

interface ActionButtonsProps {
  pnachContent: string;
  filename: string;
  gameLabel: string;
  onReset: () => void;
  onApplyToIso: (pnachContent: string) => void;
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

const btnApply = {
  background: '#d09040',
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

export function ActionButtons({ pnachContent, filename, gameLabel, onReset, onApplyToIso }: ActionButtonsProps) {
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

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

  const clearStatus = useCallback(() => setStatusMsg(null), []);

  const handleApply = useCallback(() => {
    if (!pnachContent) {
      setStatusMsg('No pnach content to apply');
      return;
    }
    onApplyToIso(pnachContent);
  }, [pnachContent, onApplyToIso]);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-3 sm:gap-4 flex-wrap">
        <button
          className="action-btn-mobile"
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
          className="action-btn-mobile"
          style={{
            ...btnApply,
            opacity: !pnachContent ? 0.6 : 1,
            cursor: !pnachContent ? 'not-allowed' : 'pointer',
          }}
          onMouseEnter={e => {
            if (pnachContent) e.currentTarget.style.background = '#e0a050';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = '#d09040';
          }}
          onMouseDown={e => {
            if (pnachContent) e.currentTarget.style.background = '#c08030';
          }}
          onMouseUp={e => {
            if (pnachContent) e.currentTarget.style.background = '#e0a050';
          }}
          onClick={handleApply}
          disabled={!pnachContent}
        >
          Apply .pnach to ISO
        </button>
        <button
          className="action-btn-mobile"
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
      {statusMsg && (
        <div
          className="flex items-center gap-2 text-xs font-sans px-3 py-2 rounded"
          style={{
            color: statusMsg.startsWith('Error') ? '#ff6b6b' : '#a0a8d0',
            background: 'rgba(14,16,38,0.5)',
            border: '1px solid rgba(80,90,160,0.12)',
          }}
        >
          <span className="flex-1">{statusMsg}</span>
          <button
            onClick={clearStatus}
            style={{
              background: 'none',
              border: 'none',
              color: '#6a6e94',
              cursor: 'pointer',
              fontSize: '0.75rem',
              padding: '2px 6px',
            }}
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}
