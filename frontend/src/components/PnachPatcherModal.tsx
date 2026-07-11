import { useCallback, useEffect, useRef, useState } from 'react';
import { ensureWasm, findElfOffset, analyzeElf, parsePnach } from '../wasm';
import type { ParsedPatch, ProgramHeader, PatchInfo } from '../wasm';
import streamSaver from 'streamsaver';
import * as ponyfill from 'web-streams-polyfill';

streamSaver.WritableStream = ponyfill.WritableStream;
streamSaver.mitm = 'mitm.html';

type LogLine = { text: string; kind: 'info' | 'ok' | 'error' | 'stage' };

const SCAN_SIZE = 128 * 1024 * 1024;
const CHUNK_SIZE = 64 * 1024 * 1024;

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

function getPatchDataSize(length: string, address: number): number {
  switch (length) {
    case 'byte': case '_byte': return 1;
    case 'short': case '_short': return 2;
    case 'word': case '_word': return 4;
    case 'extended': case '_extended':
      if (address & 0x20000000) return 4;
      if (address & 0x10000000) return 2;
      return 1;
    default: return 4;
  }
}

function computePatchLocations(
  patches: ParsedPatch[],
  programHeaders: ProgramHeader[],
  elfOffset: number,
): PatchInfo[] {
  const locations: PatchInfo[] = [];
  for (const p of patches) {
    const adjustedAddress = p.address & 0x0FFF_FFFF;
    const size = getPatchDataSize(p.length, p.address);
    for (const ph of programHeaders) {
      const phStart = ph.virt_addr;
      const phEnd = ph.virt_addr + ph.file_size;
      if (phStart <= adjustedAddress && phEnd > adjustedAddress + size) {
        locations.push({
          offset: elfOffset + ph.offset + (adjustedAddress - ph.virt_addr),
          value: p.data,
          size,
        });
        break;
      }
    }
  }
  return locations;
}

interface PnachPatcherModalProps {
  initialPnachText?: string;
  onClose: () => void;
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

      addLog(`Scanning ELF in first ${formatSize(SCAN_SIZE)} of ISO...`, 'stage');
      const scanSize = Math.min(SCAN_SIZE, isoFile.size);
      const prefix = new Uint8Array(await isoFile.slice(0, scanSize).arrayBuffer());

      const elfInfo = findElfOffset(prefix);
      addLog(`ELF found at offset 0x${elfInfo.offset.toString(16).toUpperCase()}`, 'ok');

      addLog('Parsing ELF program headers...', 'info');
      const elfData = analyzeElf(prefix, elfInfo.offset);
      addLog(`ELF has ${elfData.program_headers.length} program header(s)`, 'info');

      addLog('Parsing PNACH patches...', 'info');
      const parsedPatches = parsePnach(pnachText);
      addLog(`${parsedPatches.length} patch(es) parsed`, 'info');

      const locations = computePatchLocations(parsedPatches, elfData.program_headers, elfInfo.offset);
      if (locations.length === 0) {
        addLog('No patches could be applied - no matching addresses found', 'error');
        setPatching(false);
        return;
      }
      addLog(`${locations.length} patch(es) resolved to ISO offsets`, 'ok');
      for (const loc of locations) {
        addLog(`  Patch at ISO offset 0x${loc.offset.toString(16).toUpperCase()} = 0x${loc.value.toString(16).toUpperCase()} (${loc.size} byte(s))`, 'info');
      }

      addLog(`Streaming ${formatSize(isoFile.size)} in ${formatSize(CHUNK_SIZE)} chunks...`, 'stage');
      const outputName = isoFile.name.replace(/\.iso$/i, '_patched.iso');
      const fileStream = streamSaver.createWriteStream(outputName, { size: isoFile.size });
      const writer = fileStream.getWriter();

      let offset = 0;
      let patchedCount = 0;

      while (offset < isoFile.size) {
        const size = Math.min(CHUNK_SIZE, isoFile.size - offset);
        const chunk = new Uint8Array(await isoFile.slice(offset, offset + size).arrayBuffer());
        const chunkEnd = offset + chunk.length;

        const relevant = locations.filter(p => p.offset >= offset && p.offset < chunkEnd);
        if (relevant.length > 0) {
          const view = new DataView(chunk.buffer);
          for (const p of relevant) {
            const localOffset = p.offset - offset;
            switch (p.size) {
              case 1: view.setUint8(localOffset, p.value); break;
              case 2: view.setUint16(localOffset, p.value, true); break;
              case 4: view.setUint32(localOffset, p.value, true); break;
            }
            patchedCount++;
          }
        }

        await writer.write(chunk);
        offset += size;
        addLog(`Processing... ${formatSize(offset)} / ${formatSize(isoFile.size)} (${Math.round((offset / isoFile.size) * 100)}%)`, 'info');
      }

      await writer.close();
      addLog(`${patchedCount} patch(es) applied. Saved as: ${outputName}`, 'ok');
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
