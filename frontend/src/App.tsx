import { useMemo } from 'react';
import { useTweaksState } from './hooks/useTweaksState';
import { generatePnach } from './pnach';
import { GameSelector } from './components/GameSelector';
import { TagGroup } from './components/TagGroup';
import { DeadzoneChart } from './components/DeadzoneChart';
import { PnachOutput } from './components/PnachOutput';
import { ActionButtons } from './components/ActionButtons';
import type { DeadzoneField } from './fields';
import './App.css';

const CHART_COLORS: Record<string, string> = {
  steering: '#00d4ff', throttle: '#00ff88', brake: '#ff6b6b',
};

export default function App() {
  const { gameKey, config, values, switchGame, setValue, reset, getPercent, updatePercent } =
    useTweaksState();

  const pnachContent = useMemo(
    () => config ? generatePnach(config.fields, values, config.label, config.filename) : '',
    [config, values],
  );

  if (!config) {
    return (
      <div className="app">
        <header className="app-header">
          <h1>PS2 Configurable Tweaks</h1>
        </header>
        <main className="app-main">
          <p className="empty-state">No game config found for key: {gameKey}</p>
        </main>
      </div>
    );
  }

  const deadzoneFields = config.fields.filter((f): f is DeadzoneField => f.type === 'deadzone');

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <h1>PS2 Configurable Tweaks</h1>
          <p className="header-sub">Generate custom .pnach controller patches for PS2 racing games</p>
        </div>
      </header>

      <main className="app-main">
        <aside className="sidebar">
          <GameSelector value={gameKey} onChange={switchGame} />

          <div className="fields-list">
            <TagGroup
              fields={config.fields}
              values={values}
              onSetValue={setValue}
              getPercent={getPercent}
              onUpdatePercent={updatePercent}
            />
          </div>
        </aside>

        <section className="preview-panel">
          {deadzoneFields.length > 0 && (
            <div className="preview-section">
              <h3 className="section-title">Deadzone Preview</h3>
              <div className="charts-grid">
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

          <PnachOutput value={pnachContent} />
          <ActionButtons
            pnachContent={pnachContent}
            filename={config.filename}
            gameLabel={config.label}
            onReset={reset}
          />
        </section>
      </main>
    </div>
  );
}
