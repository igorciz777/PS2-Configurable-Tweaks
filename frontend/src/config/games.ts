import { FieldConfig } from '../fields';
import type { FieldData, TabGroupConfig } from '../fields';

export interface CameraConfig {
  id: string;
  label: string;
  fieldIds: string[];
  defaults: Record<string, [number, number, number]>;
}

interface GameData {
  id: string;
  label: string;
  group: string;
  filename: string;
  fields: FieldData[];
  tabGroups?: TabGroupConfig[];
  cameras?: CameraConfig[];
}

export interface GameEntry {
  id: string;
  label: string;
  filename: string;
  group: string;
  fields: FieldConfig[];
  tabGroups?: TabGroupConfig[];
  cameras?: CameraConfig[];
}

const gameModules = import.meta.glob<GameData>('./games/**/*.json', { eager: true, import: 'default' });

const parsed: GameEntry[] = [];
const byId: Record<string, GameEntry> = {};
const groupsMap = new Map<string, GameEntry[]>();

for (const data of Object.values(gameModules)) {
  const fields = data.fields.map(fd => FieldConfig.fromJSON(fd));
  const entry: GameEntry = {
    id: data.id, label: data.label, filename: data.filename, group: data.group, fields,
    tabGroups: data.tabGroups, cameras: data.cameras,
  };
  parsed.push(entry);
  byId[data.id] = entry;
  const list = groupsMap.get(data.group);
  if (list) {
    list.push(entry);
  } else {
    groupsMap.set(data.group, [entry]);
  }
}

const groups: { label: string; games: GameEntry[] }[] = [];
for (const [label, games] of groupsMap) {
  groups.push({ label, games });
}

export const allGames: GameEntry[] = parsed;
export const gameConfigs: Record<string, GameEntry> = byId;
export const gameGroups: { label: string; games: GameEntry[] }[] = groups;
