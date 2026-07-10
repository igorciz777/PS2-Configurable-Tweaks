import { useCallback, useRef, useState } from 'react';
import init, { compute_iso_patches } from '../wasm/wasm_patcher.js';

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

let wasmReady = false;
let wasmInitPromise: Promise<void> | null = null;

async function ensureWasm(): Promise<void> {
  if (wasmReady) return;
  if (!wasmInitPromise) {
    wasmInitPromise = init().then(() => { wasmReady = true; });
  }
  await wasmInitPromise;
}

export function ActionButtons({ pnachContent, filename, gameLabel, onReset }: ActionButtonsProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [applying, setApplying] = useState(false);
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

  const handleApply = useCallback(async () => {
    if (!pnachContent) {
      setStatusMsg('No pnach content to apply');
      return;
    }

    fileInputRef.current?.click();
  }, [pnachContent]);

  const handleFileSelected = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = '';

    setApplying(true);
    setStatusMsg('Initializing WASM module...');

    try {
      await ensureWasm();
      setStatusMsg(`Reading ISO: ${file.name}...`);

      const isoData = new Uint8Array(await file.arrayBuffer());

      setStatusMsg('Computing patch locations...');

      const resultJson = compute_iso_patches(isoData, pnachContent);
      const result = JSON.parse(resultJson);

      const patches: Array<{ offset: number; value: number; size: number }> = result.patches;

      if (!patches || patches.length === 0) {
        setStatusMsg('No patches could be applied');
        setApplying(false);
        return;
      }

      setStatusMsg(`Applying ${patches.length} patch(es)...`);

      const view = new DataView(isoData.buffer);
      for (const p of patches) {
        switch (p.size) {
          case 1: view.setUint8(p.offset, p.value); break;
          case 2: view.setUint16(p.offset, p.value, false); break;
          case 4: view.setUint32(p.offset, p.value, false); break;
        }
      }

      setStatusMsg(`Saving patched ISO (${patches.length} patches applied)...`);

      const patchedBlob = new Blob([isoData], { type: 'application/octet-stream' });

      if ('showSaveFilePicker' in window) {
        try {
          const fileHandle = await (window as any).showSaveFilePicker({
            suggestedName: file.name,
            types: [{
              description: 'ISO File',
              accept: { 'application/octet-stream': ['.iso'] },
            }],
          });
          const writable = await fileHandle.createWritable();
          await writable.write(patchedBlob);
          await writable.close();
          setStatusMsg(`Successfully patched and saved ISO`);
        } catch (err: any) {
          if (err.name === 'AbortError' || err.message?.includes('abort')) {
            setStatusMsg('Save cancelled');
          } else {
            fallbackDownload(patchedBlob, file.name);
            setStatusMsg(`Downloading patched ISO (fallback)`);
          }
        }
      } else {
        fallbackDownload(patchedBlob, file.name);
        setStatusMsg(`Downloading patched ISO`);
      }
    } catch (err: any) {
      setStatusMsg(`Error: ${err.message || err}`);
    } finally {
      setApplying(false);
    }
  }, [pnachContent]);

  return (
    <div className="flex flex-col gap-3">
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
          style={{
            ...btnPrimary,
            opacity: applying || !pnachContent ? 0.6 : 1,
            cursor: applying || !pnachContent ? 'not-allowed' : 'pointer',
          }}
          onMouseEnter={e => {
            if (!applying && pnachContent) e.currentTarget.style.background = '#5a8dff';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = '#4a7dff';
          }}
          onMouseDown={e => {
            if (!applying && pnachContent) e.currentTarget.style.background = '#3a6def';
          }}
          onMouseUp={e => {
            if (!applying && pnachContent) e.currentTarget.style.background = '#5a8dff';
          }}
          onClick={handleApply}
          disabled={applying || !pnachContent}
        >
          {applying ? 'Applying...' : 'Apply .pnach to ISO'}
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
        <input
          ref={fileInputRef}
          type="file"
          accept=".iso"
          style={{ display: 'none' }}
          onChange={handleFileSelected}
        />
      </div>
      {statusMsg && (
        <div
          className="flex items-center gap-2 text-xs font-mono px-3 py-2 rounded"
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

function fallbackDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename.replace(/\.iso$/i, '_patched.iso');
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
