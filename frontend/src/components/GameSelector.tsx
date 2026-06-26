import { useState, useMemo, useRef, useEffect } from 'react';
import { allGames, gameGroups } from '../config/games';

interface GameSelectorProps {
  value: string;
  onChange: (key: string) => void;
}

export function GameSelector({ value, onChange }: GameSelectorProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const selected = useMemo(() => allGames.find(g => g.id === value), [value]);

  const filtered = useMemo(() => {
    if (!query.trim()) return gameGroups;
    const q = query.toLowerCase();
    return gameGroups
      .map(grp => ({
        ...grp,
        games: grp.games.filter(g =>
          g.label.toLowerCase().includes(q) ||
          g.id.toLowerCase().includes(q) ||
          g.filename.toLowerCase().includes(q),
        ),
      }))
      .filter(grp => grp.games.length > 0);
  }, [query]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node) &&
          inputRef.current && !inputRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  return (
    <div className="relative">
      <label
        className="block font-mono text-xs font-semibold uppercase mb-2.5"
        style={{ color: '#6a6e94', letterSpacing: '0.1em' }}
      >
        Game Selection
      </label>
      <div
        className="flex items-center justify-between px-5 py-3.5 rounded-xl cursor-pointer transition-colors"
        style={{
          background: 'rgba(14,16,38,0.6)',
          border: '1px solid rgba(80,90,160,0.15)',
        }}
        onClick={() => { setOpen(true); setTimeout(() => inputRef.current?.focus(), 50); }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(80,90,160,0.3)'; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(80,90,160,0.15)'; }}
      >
        <span style={{ color: selected ? '#e0e4f0' : '#6a6e94', fontSize: '0.875rem' }}>
          {selected?.label || 'Select a game'}
        </span>
        <span style={{ color: '#6a6e94', fontSize: '0.5rem', letterSpacing: '0.05em' }}>▼</span>
      </div>

      {open && (
        <div
          ref={panelRef}
          className="absolute top-full left-0 right-0 z-50 mt-2 flex flex-col"
          style={{
            background: 'rgba(12,14,34,0.97)',
            border: '1px solid rgba(80,90,160,0.2)',
            borderRadius: '10px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
            maxHeight: '360px',
          }}
        >
          <input
            ref={inputRef}
            className="flex-shrink-0 px-5 py-3.5 text-sm outline-none"
            style={{
              background: 'rgba(8,9,24,0.6)',
              borderBottom: '1px solid rgba(80,90,160,0.12)',
              color: '#e0e4f0',
            }}
            placeholder="Search games..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            autoFocus
          />
          <div className="overflow-y-auto flex-1">
            {filtered.length === 0 && (
              <div className="px-6 py-10 text-center font-mono text-xs" style={{ color: '#6a6e94' }}>
                No games match your search
              </div>
            )}
            {filtered.map(group => (
              <div key={group.label}>
                <div
                  className="sticky top-0 px-5 py-2.5 font-mono text-xs font-semibold uppercase"
                  style={{ color: '#4a7dff', background: 'rgba(12,14,34,0.98)', letterSpacing: '0.1em' }}
                >
                  {group.label}
                </div>
                {group.games.map(game => (
                  <div
                    key={game.id}
                    className="px-5 py-3 cursor-pointer flex justify-between items-center transition-colors"
                    style={{
                      borderLeft: game.id === value ? '2px solid #4a7dff' : '2px solid transparent',
                      background: game.id === value ? 'rgba(74,125,255,0.06)' : 'transparent',
                    }}
                    onMouseEnter={e => { if (game.id !== value) e.currentTarget.style.background = 'rgba(74,125,255,0.03)'; }}
                    onMouseLeave={e => { if (game.id !== value) e.currentTarget.style.background = 'transparent'; }}
                    onClick={() => { onChange(game.id); setOpen(false); setQuery(''); }}
                  >
                    <span style={{ color: '#e0e4f0', fontSize: '0.875rem' }}>{game.label}</span>
                    <span className="font-mono" style={{ color: '#6a6e94', fontSize: '0.55rem' }}>{game.filename}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
