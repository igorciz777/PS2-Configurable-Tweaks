import type { RegionInfo } from '../config/games';

interface RegionSelectorProps {
  regions: Record<string, RegionInfo>;
  activeRegion: string;
  onChange: (regionKey: string) => void;
}

export function RegionSelector({ regions, activeRegion, onChange }: RegionSelectorProps) {
  const entries = Object.entries(regions);
  if (entries.length <= 1) return null;

  return (
    <div>
      <label
        className="block font-sans text-xs font-semibold uppercase mb-2.5 pl-5"
        style={{ letterSpacing: '0.1em' }}
      >
        Region
      </label>
      <div className="flex gap-2 px-5">
        {entries.map(([key, info]) => (
          <button
            key={key}
            onClick={() => onChange(key)}
            className="font-sans text-xs font-medium px-3 py-1.5 rounded-lg transition-all duration-150"
            style={{
              color: key === activeRegion ? '#e0e4f0' : '#6a6e94',
              border: key === activeRegion
                ? '1px solid rgba(74,125,255,0.4)'
                : '1px solid rgba(80,90,160,0.15)',
              background: key === activeRegion
                ? 'rgba(74,125,255,0.12)'
                : 'transparent',
            }}
            onMouseEnter={e => {
              if (key !== activeRegion) {
                e.currentTarget.style.background = 'rgba(74,125,255,0.05)';
                e.currentTarget.style.borderColor = 'rgba(80,90,160,0.3)';
              }
            }}
            onMouseLeave={e => {
              if (key !== activeRegion) {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.borderColor = 'rgba(80,90,160,0.15)';
              }
            }}
          >
            {info.label}
          </button>
        ))}
      </div>
    </div>
  );
}
