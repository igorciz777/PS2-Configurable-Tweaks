import { useCallback, useEffect, useRef, useState } from 'react';
import { ensureWasm, runComputePatches } from '../wasm';
import type { PatchResult } from '../wasm';

interface PnachPatcherModalProps {
  initialPnachText?: string;
  onClose: () => void;
}

type LogLine = { text: string; kind: 'info' | 'ok' | 'error' | 'stage' };

const styles = {
  overlay: {
    position: 'fixed' as const,
    inset: 0,
    zIndex: 9999,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'rgba(0,0,0,0.7)',
    backdropFilter: 'blur(4px)',
  },
  modal: {
    width: '780px',
    maxWidth: '95vw',
    maxHeight: '90vh',
    display: 'flex',
    flexDirection: 'column' as const,
    background: '#0c0e22',
    border: '1px solid rgba(80,90,160,0.2)',
    borderRadius: '12px',
    overflow: 'hidden',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px 24px',
    borderBottom: '1px solid rgba(80,90,160,0.12)',
  },
  title: {
    fontFamily: 'JetBrains Mono, monospace',
    fontSize: '0.875rem',
    fontWeight: 600,
    color: '#e0e4f0',
    letterSpacing: '0.03em',
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    color: '#6a6e94',
    cursor: 'pointer',
    fontSize: '1.1rem',
    padding: '4px 8px',
    borderRadius: '4px',
  },
  body: {
    padding: '24px',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '20px',
    overflowY: 'auto' as const,
    flex: 1,
  },
  label: {
    fontFamily: 'JetBrains Mono, monospace',
    fontSize: '0.75rem',
    fontWeight: 600,
    color: '#6a6e94',
    letterSpacing: '0.08em',
    textTransform: 'uppercase' as const,
    marginBottom: '8px',
  },
  fileArea: {
    display: 'flex',
    gap: '12px',
    alignItems: 'center',
  },
  filePath: {
    flex: 1,
    padding: '10px 14px',
    background: 'rgba(8,9,24,0.6)',
    border: '1px solid rgba(80,90,160,0.15)',
    borderRadius: '8px',
    color: '#c0c4d8',
    fontFamily: 'JetBrains Mono, monospace',
    fontSize: '0.8125rem',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap' as const,
  },
  browseBtn: {
    padding: '10px 20px',
    background: '#4a7dff',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 500,
    fontSize: '0.8125rem',
  },
  textarea: {
    width: '100%',
    minHeight: '160px',
    padding: '12px 14px',
    background: 'rgba(8,9,24,0.6)',
    border: '1px solid rgba(80,90,160,0.15)',
    borderRadius: '8px',
    color: '#c0c4d8',
    fontFamily: 'JetBrains Mono, monospace',
    fontSize: '0.8125rem',
    lineHeight: '1.5',
    resize: 'vertical' as const,
    outline: 'none',
  },
  loadFileBtn: {
    padding: '8px 16px',
    background: 'rgba(14,16,38,0.6)',
    color: '#c0c4d8',
    border: '1px solid rgba(80,90,160,0.15)',
    borderRadius: '8px',
    cursor: 'pointer',
    fontFamily: 'JetBrains Mono, monospace',
    fontSize: '0.75rem',
  },
  actions: {
    display: 'flex',
    gap: '12px',
  },
  patchBtn: {
    padding: '12px 32px',
    background: '#40c080',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 600,
    fontSize: '0.875rem',
  },
  patchBtnDisabled: {
    opacity: 0.5,
    cursor: 'not-allowed',
  },
  cancelBtn: {
    padding: '12px 24px',
    background: 'rgba(14,16,38,0.6)',
    color: '#c0c4d8',
    border: '1px solid rgba(80,90,160,0.15)',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '0.875rem',
  },
  terminal: {
    background: '#050614',
    border: '1px solid rgba(80,90,160,0.12)',
    borderRadius: '8px',
    padding: '16px',
    minHeight: '200px',
    maxHeight: '320px',
    overflowY: 'auto' as const,
    fontFamily: 'JetBrains Mono, monospace',
    fontSize: '0.75rem',
    lineHeight: '1.6',
  },
  logInfo: { color: '#8088b0' },
  logOk: { color: '#40c080' },
  logError: { color: '#ff6b6b' },
  logStage: { color: '#e0e4f0', fontWeight: 500 },
};

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
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

export function PnachPatcherModal({ initialPnachText, onClose }: PnachPatcherModalProps) {
  const [isoFile, setIsoFile] = useState<File | null>(null);
  const [pnachText, setPnachText] = useState(initialPnachText ?? '');
  const [patching, setPatching] = useState(false);
  const [log, setLog] = useState<LogLine[]>([]);
  const isoInputRef = useRef<HTMLInputElement>(null);
  const pnachFileInputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);

  const addLog = useCallback((text: string, kind: LogLine['kind'] = 'info') => {
    setLog(prev => [...prev, { text, kind }]);
  }, []);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [log]);

  const handleIsoBrowse = useCallback(() => {
    isoInputRef.current?.click();
  }, []);

  const handleIsoChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsoFile(file);
      setLog([]);
    }
    e.target.value = '';
  }, []);

  const handleLoadPnachFile = useCallback(() => {
    pnachFileInputRef.current?.click();
  }, []);

  const handlePnachFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = '';
    const reader = new FileReader();
    reader.onload = () => {
      setPnachText(reader.result as string);
    };
    reader.readAsText(file);
  }, []);

  const handlePatch = useCallback(async () => {
    if (!isoFile || !pnachText.trim()) return;

    setPatching(true);
    setLog([]);

    try {
      addLog('Initializing WASM module...', 'stage');
      await ensureWasm();
      addLog('WASM module loaded', 'ok');

      addLog(`Reading ISO: ${isoFile.name} (${formatSize(isoFile.size)})...`, 'stage');
      const isoData = new Uint8Array(await isoFile.arrayBuffer());
      addLog(`ISO loaded: ${formatSize(isoData.length)}`, 'ok');

      addLog('Parsing pnach patches...', 'stage');
      addLog('Computing patch locations (ELF scan)...', 'stage');

      const result: PatchResult = runComputePatches(isoData, pnachText);

      if (!result.patches || result.patches.length === 0) {
        addLog('No patches could be applied - no matching addresses found', 'error');
        setPatching(false);
        return;
      }

      addLog(`Found ${result.patches.length} patch(es) to apply`, 'info');
      addLog(`ELF offset: 0x${result.elf_offset.toString(16).toUpperCase()}`, 'info');

      addLog('Applying patches to ISO data in memory...', 'stage');
      const view = new DataView(isoData.buffer);
      for (let i = 0; i < result.patches.length; i++) {
        const p = result.patches[i];
        switch (p.size) {
          case 1: view.setUint8(p.offset, p.value); break;
          case 2: view.setUint16(p.offset, p.value, true); break;
          case 4: view.setUint32(p.offset, p.value, true); break;
        }
      }
      addLog(`Successfully applied ${result.patches.length} patch(es)`, 'ok');

      addLog('Saving patched ISO...', 'stage');
      const patchedBlob = new Blob([isoData], { type: 'application/octet-stream' });

      if ('showSaveFilePicker' in window) {
        try {
          const fileHandle = await (window as any).showSaveFilePicker({
            suggestedName: isoFile.name,
            types: [{
              description: 'ISO File',
              accept: { 'application/octet-stream': ['.iso'] },
            }],
          });
          const writable = await fileHandle.createWritable();
          await writable.write(patchedBlob);
          await writable.close();
          addLog(`Patched ISO saved successfully: ${isoFile.name}`, 'ok');
        } catch (err: any) {
          if (err.name === 'AbortError' || err.message?.includes('abort')) {
            addLog('Save cancelled by user', 'error');
          } else {
            fallbackDownload(patchedBlob, isoFile.name);
            addLog('Downloading patched ISO (fallback mode)', 'info');
          }
        }
      } else {
        fallbackDownload(patchedBlob, isoFile.name);
        addLog('Downloading patched ISO', 'info');
      }

      addLog('Done!', 'ok');
    } catch (err: any) {
      addLog(`Error: ${err.message || err}`, 'error');
    } finally {
      setPatching(false);
    }
  }, [isoFile, pnachText, addLog]);

  const handleOverlayClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  }, [onClose]);

  const canPatch = !patching && isoFile && pnachText.trim().length > 0;

  return (
    <div style={styles.overlay} onClick={handleOverlayClick}>
      <div style={styles.modal}>
        <div style={styles.header}>
          <span style={styles.title}>Patch .pnach to ISO</span>
          <button style={styles.closeBtn} onClick={onClose}>✕</button>
        </div>

        <div style={styles.body}>
          <div>
            <div style={styles.label}>ISO File</div>
            <div style={styles.fileArea}>
              <div style={styles.filePath}>
                {isoFile ? isoFile.name : 'No file selected'}
              </div>
              <button style={styles.browseBtn} onClick={handleIsoBrowse}>
                Browse
              </button>
              <input
                ref={isoInputRef}
                type="file"
                accept=".iso"
                style={{ display: 'none' }}
                onChange={handleIsoChange}
              />
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={styles.label}>Pnach Text</span>
              <button style={styles.loadFileBtn} onClick={handleLoadPnachFile}>
                Load from file
              </button>
              <input
                ref={pnachFileInputRef}
                type="file"
                accept=".pnach,.txt"
                style={{ display: 'none' }}
                onChange={handlePnachFileChange}
              />
            </div>
            <textarea
              style={styles.textarea}
              placeholder="Paste your pnach content here..."
              value={pnachText}
              onChange={e => setPnachText(e.target.value)}
            />
          </div>

          <div>
            <div style={styles.label}>Output</div>
            <div ref={terminalRef} style={styles.terminal}>
              {log.length === 0 ? (
                <span style={styles.logInfo}>Waiting for patching to start...</span>
              ) : (
                log.map((line, i) => {
                  const key = `log${line.kind.charAt(0).toUpperCase() + line.kind.slice(1)}` as keyof typeof styles;
                  return (
                    <div key={i} style={styles[key] || styles.logInfo}>
                      {line.text}
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ flex: 1, fontFamily: 'JetBrains Mono, monospace', fontSize: '0.7rem', color: '#6a6e94', lineHeight: 1.5 }}>
              All processing is done entirely in your browser via WebAssembly.
              Your ISO file and pnach data are never uploaded or stored anywhere.
            </div>
            <button
              style={{ ...styles.patchBtn, ...(canPatch ? {} : styles.patchBtnDisabled) }}
              disabled={!canPatch}
              onClick={handlePatch}
            >
              {patching ? 'Patching...' : 'Patch ISO'}
            </button>
            <button style={styles.cancelBtn} onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
