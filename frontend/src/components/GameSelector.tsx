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

  const select = (id: string) => {
    onChange(id);
    setOpen(false);
    setQuery('');
  };

  return (
    <div className="game-selector">
      <label className="field-label">Game</label>
      <div className="game-selector-input" onClick={() => { setOpen(true); setTimeout(() => inputRef.current?.focus(), 50); }}>
        <span className="game-selector-selected">{selected?.label || 'Select a game'}</span>
        <span className="game-selector-arrow">{open ? '▲' : '▼'}</span>
      </div>

      {open && (
        <div className="game-selector-panel" ref={panelRef}>
          <input
            ref={inputRef}
            className="game-selector-search"
            placeholder="Search games..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            autoFocus
          />
          <div className="game-selector-list">
            {filtered.length === 0 && (
              <div className="game-selector-empty">No games match your search</div>
            )}
            {filtered.map(group => (
              <div key={group.label} className="game-selector-group">
                <div className="game-selector-group-label">{group.label}</div>
                {group.games.map(game => (
                  <div
                    key={game.id}
                    className={`game-selector-item ${game.id === value ? 'selected' : ''}`}
                    onClick={() => select(game.id)}
                  >
                    <span className="game-selector-item-label">{game.label}</span>
                    <span className="game-selector-item-id">{game.filename}</span>
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
