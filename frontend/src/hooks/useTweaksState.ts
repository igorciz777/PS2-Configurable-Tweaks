import { useState, useCallback, useMemo, useEffect } from 'react';
import type { TweakValues, TweakValue, PercentField } from '../fields';
import { gameConfigs, type CameraConfig } from '../config/games';
import { getValueFromPercentage, getPercentageFromValue } from '../utils/percentMapping';
import { readUrlState, writeUrlState } from '../utils/urlState';

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

function initFromUrl(): { gameKey: string; activeRegion: string | undefined; values: TweakValues; activeCamera: string | undefined } {
  const url = readUrlState();
  const gameKey = url.game && gameConfigs[url.game] ? url.game : 'kb1';
  const config = gameConfigs[gameKey];
  const regionKeys = config?.regions ? Object.keys(config.regions) : [];
  const activeRegion = url.region && regionKeys.includes(url.region) ? url.region : regionKeys[0];

  const regionFields = activeRegion && config?.regions?.[activeRegion]?.fieldIds
    ? config!.fields.filter(f => config!.regions![activeRegion].fieldIds!.includes(f.id))
    : config?.fields ?? [];
  const regionCameras = activeRegion && config?.regions?.[activeRegion]?.cameras
    ? config!.regions[activeRegion].cameras
    : config?.cameras;

  const defaults = getFieldDefaults(regionFields, regionCameras);
  const values = url.values ? { ...defaults, ...url.values } : defaults;
  const activeCamera = regionCameras?.[0]?.id;

  return { gameKey, activeRegion, values, activeCamera };
}

export function useTweaksState() {
  const [init] = useState(initFromUrl);
  const [gameKey, setGameKey] = useState(init.gameKey);

  const config = useMemo(() => gameConfigs[gameKey], [gameKey]);

  const [activeRegion, setActiveRegion] = useState<string | undefined>(init.activeRegion);
  const [activeCamera, setActiveCamera] = useState<string | undefined>(init.activeCamera);
  const [values, setValues] = useState<TweakValues>(init.values);

  const resolvedFields = useMemo(() => {
    if (!config) return [];
    if (activeRegion && config.regions?.[activeRegion]?.fieldIds) {
      const ids = new Set(config.regions[activeRegion].fieldIds);
      return config.fields.filter(f => ids.has(f.id));
    }
    return config.fields;
  }, [config, activeRegion]);

  const resolvedCameras = useMemo(() => {
    if (!config) return undefined;
    if (activeRegion && config.regions?.[activeRegion]?.cameras) {
      return config.regions[activeRegion].cameras;
    }
    return config.cameras;
  }, [config, activeRegion]);

  const defaults = useMemo(() => {
    if (!config) return {};
    return getFieldDefaults(resolvedFields, resolvedCameras);
  }, [config, resolvedFields, resolvedCameras]);

  useEffect(() => {
    writeUrlState(gameKey, activeRegion, defaults, values);
  }, [gameKey, activeRegion, defaults, values]);

  const resolvedTabGroups = useMemo(() => {
    if (!config) return undefined;
    if (activeRegion && config.regions?.[activeRegion]?.tabGroups) {
      return config.regions[activeRegion].tabGroups;
    }
    return config.tabGroups;
  }, [config, activeRegion]);

  const resolvedFilename = useMemo(() => {
    if (!config) return '';
    if (activeRegion && config.regions?.[activeRegion]) {
      return config.regions[activeRegion].filename;
    }
    return config.filename;
  }, [config, activeRegion]);

  const resolvedLabel = useMemo(() => {
    if (!config) return '';
    if (activeRegion && config.regions?.[activeRegion]) {
      return config.regions[activeRegion].label;
    }
    return config.label;
  }, [config, activeRegion]);

  const switchGame = useCallback((key: string) => {
    const cfg = gameConfigs[key];
    if (!cfg) return;
    setGameKey(key);
    const rKeys = cfg.regions ? Object.keys(cfg.regions) : [];
    const firstRegion = rKeys.length > 0 ? rKeys[0] : undefined;
    setActiveRegion(firstRegion);
    const regionFields = firstRegion && cfg.regions?.[firstRegion]?.fieldIds
      ? cfg.fields.filter(f => cfg.regions![firstRegion].fieldIds!.includes(f.id))
      : cfg.fields;
    const regionCameras = firstRegion && cfg.regions?.[firstRegion]?.cameras
      ? cfg.regions[firstRegion].cameras
      : cfg.cameras;
    setValues(getFieldDefaults(regionFields, regionCameras));
    setActiveCamera(regionCameras?.[0]?.id);
  }, []);

  const setValue = useCallback((key: string, val: TweakValue) => {
    setValues(prev => ({ ...prev, [key]: val }));
  }, []);

  const reset = useCallback(() => {
    if (config) setValues(getFieldDefaults(resolvedFields, resolvedCameras));
  }, [config, resolvedFields, resolvedCameras]);

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
    gameKey, config, values, activeCamera, activeRegion,
    resolvedFields, resolvedCameras, resolvedTabGroups,
    switchGame, setValue, reset, getPercent, updatePercent,
    setActiveCamera, setActiveRegion,
    resolvedFilename, resolvedLabel,
  };
}

export { gameConfigs } from '../config/games';
