interface AboutModalProps {
  onClose: () => void;
}

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
    width: '620px',
    maxWidth: '95vw',
    maxHeight: '85vh',
    display: 'flex',
    flexDirection: 'column' as const,
    background: '#1c2345',
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
    overflowY: 'auto' as const,
    fontFamily: 'JetBrains Mono, monospace',
    fontSize: '0.8rem',
    lineHeight: 1.7,
    color: '#a0a8d0',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '16px',
  },
  heading: {
    color: '#e0e4f0',
    fontSize: '0.85rem',
    fontWeight: 600,
    letterSpacing: '0.03em',
  },
  link: {
    color: '#4a7dff',
    textDecoration: 'none',
  },
  muted: {
    color: '#6a6e94',
    fontSize: '0.75rem',
  },
};

export function AboutModal({ onClose }: AboutModalProps) {
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div style={styles.overlay} onClick={handleOverlayClick}>
      <div style={styles.modal}>
        <div style={styles.header}>
          <span style={styles.title}>About</span>
          <button style={styles.closeBtn} onClick={onClose}>✕</button>
        </div>
        <div style={styles.body}>
          <div>
            <div style={styles.heading}>PS2 Configurable Tweaks</div>
            <div style={{ marginTop: '4px' }}>
              A web-based tool for generating, adjusting and applying .pnach cheat files for PS2 games.
              Made by <a href="https://github.com/igorciz777" style={styles.link} target="_blank" rel="noopener noreferrer">igorciz777</a>
            </div>
          </div>

          <div>
            <div style={styles.heading}>Client-Side Only</div>
            <div>
              All processing is done entirely in your browser via WebAssembly.
              Your ISO file and pnach data are never uploaded or stored anywhere.
            </div>
          </div>

          <div>
            <div style={styles.heading}>License</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div>
                <strong style={{ color: '#e0e4f0' }}>PS2 Configurable Tweaks</strong> — GNU General Public License v3.0
                <br />
                The source code for PS2 Configurable Tweaks is available at{' '}
                <a href="https://github.com/igorciz777/PS2-Configurable-Tweaks" style={styles.link} target="_blank" rel="noopener noreferrer">github.com/igorciz777/PS2-Configurable-Tweaks</a>.
              </div>
              <div>
                <strong style={{ color: '#e0e4f0' }}>PCSX2</strong> — GNU General Public License v3.0
                <br />
                Some game patches included in this project are sourced from the PCSX2 community. PCSX2 is available at{' '}
                <a href="https://github.com/PCSX2/pcsx2" style={styles.link} target="_blank" rel="noopener noreferrer">github.com/PCSX2/pcsx2</a>.
              </div>
              <div>
                <strong style={{ color: '#e0e4f0' }}>PS2_Pnacher</strong> — GNU General Public License v3.0
                <br />
                The ISO patching logic is based on{' '}
                <a href="https://github.com/Snaggly/PS2_Pnacher" style={styles.link} target="_blank" rel="noopener noreferrer">PS2_Pnacher</a> by Snaggly, licensed under GPLv3.
              </div>
            </div>
          </div>

          <div style={styles.muted}>
            This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
          </div>
        </div>
      </div>
    </div>
  );
}
