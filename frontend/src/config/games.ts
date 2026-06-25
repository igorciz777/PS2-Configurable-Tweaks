import { FieldConfig } from '../fields';
import type { FieldData } from '../fields';
import gamesData from './games.json';

interface GroupData {
  label: string;
  games: GameData[];
}

interface GameData {
  id: string;
  label: string;
  filename: string;
  fields: FieldData[];
}

export interface GameEntry {
  id: string;
  label: string;
  filename: string;
  group: string;
  fields: FieldConfig[];
}

const parsed: GameEntry[] = [];
const byId: Record<string, GameEntry> = {};
const groups: { label: string; games: GameEntry[] }[] = [];

for (const grp of (gamesData as { groups: GroupData[] }).groups) {
  const entries: GameEntry[] = [];
  for (const g of grp.games) {
    const fields = g.fields.map(fd => FieldConfig.fromJSON(fd));
    const entry: GameEntry = {
      id: g.id, label: g.label, filename: g.filename, group: grp.label, fields,
    };
    parsed.push(entry);
    byId[g.id] = entry;
    entries.push(entry);
  }
  groups.push({ label: grp.label, games: entries });
}

export const allGames: GameEntry[] = parsed;
export const gameConfigs: Record<string, GameEntry> = byId;
export const gameGroups: { label: string; games: GameEntry[] }[] = groups;
