import type { GameConfig } from '../../types/gameConfig';
import { kb1, kb1kr, txrd1 } from './kb1';
import { kb2, kb2kr, kr1 } from './kb2';
import { kb3, kr2, txrd2 } from './kb3';
import { sb01, txr3, txr3wf } from './sb01';
import { rbc1, rbc1tl } from './rbc1';

export const allGames: GameConfig[] = [
  kb1, kb1kr, txrd1,
  kb2, kb2kr, kr1,
  kb3, kr2, txrd2,
  sb01, txr3, txr3wf,
  rbc1, rbc1tl,
];

export const gameConfigs: Record<string, GameConfig> = {};
for (const g of allGames) gameConfigs[g.id] = g;

export const gameGroups: { label: string; games: GameConfig[] }[] = [
  { label: 'Kaido Battle 1', games: [kb1, kb1kr, txrd1] },
  { label: 'Kaido Battle 2', games: [kb2, kb2kr, kr1] },
  { label: 'Kaido Battle 3', games: [kb3, kr2, txrd2] },
  { label: 'Shutokou Battle 01', games: [sb01, txr3, txr3wf] },
  { label: 'RACING BATTLE C1 Grand Prix', games: [rbc1, rbc1tl] },
];
