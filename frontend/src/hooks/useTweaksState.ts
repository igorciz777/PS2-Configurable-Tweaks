import { useState, useCallback, useMemo } from 'react';
import type { TweakValues, TweakValue, PercentField } from '../fields';
import { gameConfigs, type CameraConfig } from '../config/games';
import { getValueFromPercentage, getPercentageFromValue } from '../utils/percentMapping';

function getFieldDefaults(fields: { getDefaults(): TweakValues }[], cameras?: CameraConfig[]): TweakValues {
  const values: TweakValues = {};
  for (const field of fields) {
    Object.assign(values, field.getDefaults());
  }
  if (cameras) {
    for (const cam of cameras) {
      for (const [fieldId, vec] of Object.entries(cam.defaults)) {
        values[`${cam.id}${fieldId}X`] = vec[0];
        values[`${cam.id}${fieldId}Y`] = vec[1];
        values[`${cam.id}${fieldId}Z`] = vec[2];
      }
    }
  }
  return values;
}

export function useTweaksState() {
  const [gameKey, setGameKey] = useState('kb1');

  const config = useMemo(() => gameConfigs[gameKey], [gameKey]);

  const cameras = config?.cameras;

  const [activeCamera, setActiveCamera] = useState<string | undefined>(
    cameras?.[0]?.id,
  );

  const [values, setValues] = useState<TweakValues>(() =>
    getFieldDefaults(config?.fields ?? [], config?.cameras),
  );

  const switchGame = useCallback((key: string) => {
    const cfg = gameConfigs[key];
    if (!cfg) return;
    setGameKey(key);
    setValues(getFieldDefaults(cfg.fields, cfg.cameras));
    setActiveCamera(cfg.cameras?.[0]?.id);
  }, []);

  const setValue = useCallback((key: string, val: TweakValue) => {
    setValues(prev => ({ ...prev, [key]: val }));
  }, []);

  const reset = useCallback(() => {
    if (config) setValues(getFieldDefaults(config.fields, config.cameras));
  }, [config]);

  const getPercent = useCallback((fieldId: string): number => {
    const fields = config?.fields ?? [];
    const field = fields.find(f => f.id === fieldId);
    if (!field || field.type !== 'percent') return 50;
    const val = values[fieldId];
    if (typeof val !== 'number') return 50;
    const pf = field as PercentField;
    const pct = getPercentageFromValue(
      { min: pf.min, max: pf.max, value: String(pf.default), isInverse: pf.isInverse },
      val,
    );
    return pct;
  }, [config, values]);

  const updatePercent = useCallback((fieldId: string, percent: number) => {
    const fields = config?.fields ?? [];
    const field = fields.find(f => f.id === fieldId);
    if (!field || field.type !== 'percent') return;
    const pf = field as PercentField;
    const gameValue = getValueFromPercentage(
      { min: pf.min, max: pf.max, value: String(pf.default), isInverse: pf.isInverse },
      percent, 200,
    );
    setValues(prev => ({ ...prev, [fieldId]: gameValue }));
  }, [config]);

  return {
    gameKey, config, values, activeCamera, switchGame, setValue, reset, getPercent, updatePercent, setActiveCamera,
  };
}

export { gameConfigs } from '../config/games';
