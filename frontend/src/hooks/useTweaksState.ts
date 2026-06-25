import { useState, useCallback, useMemo } from 'react';
import type { TweakValues, TweakValue, PercentField } from '../fields';
import { gameConfigs } from '../config/games';
import { getValueFromPercentage, getPercentageFromValue } from '../utils/percentMapping';

function getFieldDefaults(fields: { getDefaults(): TweakValues }[]): TweakValues {
  const values: TweakValues = {};
  for (const field of fields) {
    Object.assign(values, field.getDefaults());
  }
  return values;
}

export function useTweaksState() {
  const [gameKey, setGameKey] = useState('kb1');

  const config = useMemo(() => gameConfigs[gameKey], [gameKey]);

  const [values, setValues] = useState<TweakValues>(() =>
    getFieldDefaults(config?.fields ?? []),
  );

  const switchGame = useCallback((key: string) => {
    const cfg = gameConfigs[key];
    if (!cfg) return;
    setGameKey(key);
    setValues(getFieldDefaults(cfg.fields));
  }, []);

  const setValue = useCallback((key: string, val: TweakValue) => {
    setValues(prev => ({ ...prev, [key]: val }));
  }, []);

  const reset = useCallback(() => {
    if (config) setValues(getFieldDefaults(config.fields));
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
    gameKey, config, values, switchGame, setValue, reset, getPercent, updatePercent,
  };
}

export { gameConfigs } from '../config/games';
