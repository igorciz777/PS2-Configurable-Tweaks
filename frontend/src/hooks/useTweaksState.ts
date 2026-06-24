import { useState, useCallback, useMemo } from 'react';
import type { TweakField, TweakValues } from '../types/gameConfig';
import { gameConfigs } from '../config/games';
import { getValueFromPercentage, getPercentageFromValue } from '../utils/percentMapping';

function getFieldDefaults(fields: TweakField[]): TweakValues {
  const values: TweakValues = {};
  for (const field of fields) {
    switch (field.type) {
      case 'range':
        values[field.id] = field.default;
        break;
      case 'percent':
        values[field.id] = parseFloat(field.range.value);
        break;
      case 'checkbox':
        values[field.id] = field.default;
        break;
      case 'deadzone': {
        values[`${field.axis}Low`] = parseFloat(field.lowRange.value);
        values[`${field.axis}Mid`] = parseFloat(field.midRange.value);
        values[`${field.axis}High`] = parseFloat(field.highRange.value);
        break;
      }
    }
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

  const setValue = useCallback((key: string, val: number | boolean) => {
    setValues(prev => ({ ...prev, [key]: val }));
  }, []);

  const reset = useCallback(() => {
    if (config) setValues(getFieldDefaults(config.fields));
  }, [config]);

  const getPercent = useCallback((fieldId: string): number => {
    const field = config?.fields.find(f => f.id === fieldId);
    if (!field || field.type !== 'percent') return 50;
    const val = values[fieldId];
    if (typeof val !== 'number') return 50;
    return getPercentageFromValue(field.range, val);
  }, [config, values]);

  const updatePercent = useCallback((fieldId: string, percent: number) => {
    const field = config?.fields.find(f => f.id === fieldId);
    if (!field || field.type !== 'percent') return;
    const gameValue = getValueFromPercentage(field.range, percent, 200);
    setValues(prev => ({ ...prev, [fieldId]: gameValue }));
  }, [config]);

  return {
    gameKey, config, values, switchGame, setValue, reset, getPercent, updatePercent,
  };
}
