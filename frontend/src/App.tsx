import { useMemo, useState } from 'react';
import { useTweaksState } from './hooks/useTweaksState';
import { generatePnach } from './pnach';
import { GameSelector } from './components/GameSelector';
import { TagGroup } from './components/TagGroup';
import { DeadzoneChart } from './components/DeadzoneChart';
import { PnachOutput } from './components/PnachOutput';
import { ActionButtons } from './components/ActionButtons';
import { PnachPatcherModal } from './components/PnachPatcherModal';
import { AboutModal } from './components/AboutModal';
import type { DeadzoneField } from './fields';
import './App.css';

const CHART_COLORS: Record<string, string> = {
  steering: '#4a7dff',
  throttle: '#40c080',
  brake: '#d06060',
};

export default function App() {
  const { gameKey, config, values, switchGame, setValue, reset, getPercent, updatePercent } =
    useTweaksState();
  const [patcherOpen, setPatcherOpen] = useState(false);
  const [patcherPnach, setPatcherPnach] = useState('');
  const [aboutOpen, setAboutOpen] = useState(false);

  const pnachContent = useMemo(
    () => config ? generatePnach(config.fields, values, config.label, config.filename) : '',
    [config, values],
  );

  if (!config) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-slate-900 via-blue-950 to-slate-900">
        <header className="border-b border-slate-800/60 px-8 py-5 flex items-center bg-slate-950/80 backdrop-blur-sm">
          <h1 className="text-xl font-semibold" style={{ color: '#e0e4f0', letterSpacing: '0.02em' }}>PS2 Configurable Tweaks</h1>
        </header>
        <main className="flex-1 flex items-center justify-center">
          <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.875rem' }}>No game config found for key: {gameKey}</p>
        </main>
      </div>
    );
  }

  const deadzoneFields = config.fields.filter((f): f is DeadzoneField => f.type === 'deadzone');

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-slate-850 via-blue-850 to-slate-800">
      {/* ── Top Bar ── */}
      <header className="flex items-center justify-between px-8 py-5 border-b border-slate-800/60 backdrop-blur-sm select-none bg-slate-950/80">
        <div className="flex items-center gap-5">
          <h1 className="text-xl font-semibold" style={{ color: '#e0e4f0', letterSpacing: '0.02em' }}>PS2 Configurable Tweaks</h1>
          <div className="w-px h-6" style={{ background: 'rgba(80,90,160,0.2)' }} />
          <button
            onClick={() => { setPatcherPnach(''); setPatcherOpen(true); }}
            className="font-sans text-xs font-semibold uppercase tracking-wider px-4 py-2 rounded-lg transition-all duration-150"
            style={{
              color: '#40c080',
              border: '1px solid rgba(64,192,128,0.3)',
              background: 'rgba(64,192,128,0.1)',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'rgba(64,192,128,0.2)';
              e.currentTarget.style.borderColor = 'rgba(64,192,128,0.5)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'rgba(64,192,128,0.1)';
              e.currentTarget.style.borderColor = 'rgba(64,192,128,0.3)';
            }}
          >
            Patch ISO
          </button>
          <button
            onClick={() => setAboutOpen(true)}
            className="font-sans text-xs font-semibold uppercase tracking-wider px-3 py-1.5 rounded-lg transition-all duration-150"
            style={{
              color: '#6a6e94',
              border: '1px solid rgba(80,90,160,0.2)',
              background: 'transparent',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'rgba(80,90,160,0.1)';
              e.currentTarget.style.borderColor = 'rgba(80,90,160,0.35)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.borderColor = 'rgba(80,90,160,0.2)';
            }}
          >
            About
          </button>
        </div>
      </header>

      {/* ── Main Content ── */}
      <main className="flex-1 flex flex-col min-[1366px]:flex-row gap-8 p-8" style={{ maxWidth: '1440px', margin: '0 auto', width: '100%' }}>
        {/* ── Sidebar ── */}
        <aside className="flex flex-col gap-5 flex-1" style={{ minWidth: '320px' }}>
          <GameSelector value={gameKey} onChange={switchGame} />
          <div className="flex-1 overflow-y-auto px-4" style={{ paddingRight: 'calc(0.25rem + 6px)' }}>
            <TagGroup
              fields={config.fields}
              values={values}
              onSetValue={setValue}
              getPercent={getPercent}
              onUpdatePercent={updatePercent}
            />
          </div>
        </aside>

        {/* ── Preview Panel ── */}
        <section className="flex-1 flex flex-col gap-6" style={{ minWidth: 0 }}>
          {deadzoneFields.length > 0 && (
            <div
              className="p-6 rounded-xl border"
              style={{ background: 'rgba(14,16,38,0.5)', borderColor: 'rgba(80,90,160,0.12)' }}
            >
              <h3
                className="font-sans text-xs font-semibold uppercase mb-5"
                style={{ letterSpacing: '0.1em' }}
              >
                Deadzone Preview
              </h3>
              <div className="grid grid-cols-3 gap-1 h-64">
                {deadzoneFields.map(field => {
                  const a = field.axis;
                  const color = CHART_COLORS[a] || '#888';
                  return (
                    <DeadzoneChart
                      key={field.id}
                      title={field.label}
                      color={color}
                      low={values[`${a}Low`] as number || 0}
                      mid={values[`${a}Mid`] as number || 0.5}
                      high={values[`${a}High`] as number || 1}
                    />
                  );
                })}
              </div>
            </div>
          )}

          <div
            className="flex flex-col p-6 rounded-xl border"
            style={{ background: 'rgba(14,16,38,0.5)', borderColor: 'rgba(80,90,160,0.12)' }}
          >
            <h3
              className="font-sans text-xs font-semibold uppercase mb-5"
              style={{ letterSpacing: '0.1em' }}
            >
              .pnach Preview
            </h3>
            <PnachOutput value={pnachContent} />
          </div>

          <ActionButtons
            pnachContent={pnachContent}
            filename={config.filename}
            gameLabel={config.label}
            onReset={reset}
            onApplyToIso={(content) => { setPatcherPnach(content); setPatcherOpen(true); }}
          />
        </section>
      </main>

      {patcherOpen && (
        <PnachPatcherModal
          initialPnachText={patcherPnach}
          onClose={() => setPatcherOpen(false)}
        />
      )}
      {aboutOpen && (
        <AboutModal onClose={() => setAboutOpen(false)} />
      )}
    </div>
  );
}
