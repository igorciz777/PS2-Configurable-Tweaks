import type { GameConfig, PatchLine, DeadzoneField } from '../../types/gameConfig';

const smoothing = { min: 0.0020825, max: 0.1666, step: 0.00001, value: '0.01666', isInverse: true };
const reduction = { min: 0, max: 7.2, step: 0.1, value: '3.6', isInverse: false };
const low = { min: 0, max: 1, step: 0.01, value: '0.1', isInverse: false };
const mid = { min: 0, max: 1, step: 0.01, value: '0.50', isInverse: false };
const high = { min: 0, max: 1, step: 0.01, value: '0.9', isInverse: false };

interface DzAddr {
  low: string; low2: string;
  mid: string;
  mml: string; mml2: string;
}

function dzFields(addrs: Record<string, DzAddr>): DeadzoneField[] {
  return Object.entries(addrs).map(([axis, a]) => {
    const cap = axis.charAt(0).toUpperCase() + axis.slice(1);
    const patches: PatchLine[] = [
      { address: a.low, type: 'extended' as const, value: `{{${axis}Low_LO}}` },
      { address: a.low2, type: 'extended' as const, value: `{{${axis}Low_HI}}` },
      { address: a.mid, type: 'extended' as const, value: `{{${axis}Mid_LO}}` },
      { address: a.mml, type: 'extended' as const, value: `{{${axis}MidMinusLow_LO}}` },
      { address: a.mml2, type: 'extended' as const, value: `{{${axis}MidMinusLow_HI}}` },
    ];
    return {
      id: `${axis}Deadzone`, type: 'deadzone', label: `${cap} Deadzone`,
      axis, lowRange: low, midRange: mid, highRange: high, patches,
    };
  });
}

function buildGroup(addrs: { smoothing: string; reduction: string; dz: Record<string, DzAddr> }) {
  return [
    {
      id: 'smoothing', type: 'percent' as const, label: 'Steering Smoothing',
      range: smoothing,
      patches: [{ address: addrs.smoothing, type: 'extended' as const, value: '{{smoothing_LO}}' }],
    },
    {
      id: 'reduction', type: 'percent' as const, label: 'Steering Reduction Effect',
      range: reduction,
      patches: [{ address: addrs.reduction, type: 'extended' as const, value: '{{reduction_LO}}' }],
    },
    ...dzFields(addrs.dz),
  ];
}

const kb2Addrs = {
  smoothing: '101CE51C', reduction: '101706A0',
  dz: {
    steering: { low: '101c8780', low2: '101c8784', mid: '101c8888', mml: '101c87c0', mml2: '101c87c4' },
    throttle: { low: '101c8d90', low2: '101c8d94', mid: '101c8db8', mml: '101c8dd4', mml2: '101c8dd8' },
    brake: { low: '101c8e60', low2: '101c8e64', mid: '101c8e88', mml: '101c8ea4', mml2: '101c8ea8' },
  },
};

const kb2krAddrs = {
  smoothing: '101cd33c', reduction: '10170730',
  dz: {
    steering: { low: '101c7560', low2: '101c7564', mid: '101c7588', mml: '101c75a0', mml2: '101c75a4' },
    throttle: { low: '101c7b70', low2: '101c7b74', mid: '101c7b98', mml: '101c7bb4', mml2: '101c7bb8' },
    brake: { low: '101c7c40', low2: '101c7c44', mid: '101c7c68', mml: '101c7c84', mml2: '101c7c88' },
  },
};

const kr1Addrs = {
  smoothing: '101CE01C', reduction: '1016C134',
  dz: {
    steering: { low: '101c84a8', low2: '101c84ac', mid: '101c84c4', mml: '101c84e0', mml2: '101c84e4' },
    throttle: { low: '101c8a58', low2: '101c8a5c', mid: '101c8a74', mml: '101c8a90', mml2: '101c8a94' },
    brake: { low: '101c8b20', low2: '101c8b24', mid: '101c8b3c', mml: '101c8b58', mml2: '101c8b5c' },
  },
};

export const kb2: GameConfig = {
  id: 'kb2', label: 'Kaido Battle 2 (JP)', filename: 'SLPM-65514_C37C1B76.pnach',
  group: 'Kaido Battle 2', fields: buildGroup(kb2Addrs),
};

export const kb2kr: GameConfig = {
  id: 'kb2kr', label: 'Kaido Battle 2 (KR)', filename: 'SLKA-25146_D285B3DF.pnach',
  group: 'Kaido Battle 2', fields: buildGroup(kb2krAddrs),
};

export const kr1: GameConfig = {
  id: 'kr1', label: 'Kaido Racer (EU)', filename: 'SLES-53191_F7780E06.pnach',
  group: 'Kaido Battle 2', fields: buildGroup(kr1Addrs),
};
