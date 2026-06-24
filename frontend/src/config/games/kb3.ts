import type { GameConfig, DeadzoneField } from '../../types/gameConfig';

const smoothing = { min: 0.004165, max: 0.0833, step: 0.00001, value: '0.01666', isInverse: true };
const reduction = { min: 1, max: 18, step: 0.1, value: '9.0', isInverse: true };
const low = { min: 0, max: 1, step: 0.01, value: '0.1', isInverse: false };
const mid = { min: 0, max: 1, step: 0.01, value: '0.50', isInverse: false };
const high = { min: 0, max: 1, step: 0.01, value: '0.9', isInverse: false };

interface DzAddr { low: string; mid: string; high: string; }

function dzFields(addrs: Record<string, DzAddr>): DeadzoneField[] {
  return Object.entries(addrs).map(([axis, a]) => {
    const cap = axis.charAt(0).toUpperCase() + axis.slice(1);
    return {
      id: `${axis}Deadzone`, type: 'deadzone', label: `${cap} Deadzone`,
      axis, lowRange: low, midRange: mid, highRange: high,
      patches: [
        { address: a.low, type: 'word' as const, value: `{{${axis}Low}}` },
        { address: a.mid, type: 'word' as const, value: `{{${axis}Mid}}` },
        { address: a.high, type: 'word' as const, value: `{{${axis}High}}` },
      ],
    };
  });
}

function buildGroup(addrs: { smoothing: string; reduction: string; reduction2: string; dz: Record<string, DzAddr> }) {
  return [
    {
      id: 'smoothing', type: 'percent' as const, label: 'Steering Smoothing',
      range: smoothing,
      patches: [{ address: addrs.smoothing, type: 'extended' as const, value: '{{smoothing_LO}}' }],
    },
    {
      id: 'reduction', type: 'percent' as const, label: 'Steering Reduction Effect',
      range: reduction,
      patches: [
        { address: addrs.reduction, type: 'word' as const, value: `3C02{{reduction_LO}}` },
        { address: addrs.reduction2, type: 'word' as const, value: `44820800` },
      ],
    },
    ...dzFields(addrs.dz),
  ];
}

const kb3Addrs = {
  smoothing: '101709e4', reduction: '0016c270', reduction2: '0016C274',
  dz: {
    steering: { low: '003d54a4', mid: '003d54c8', high: '003d54ac' },
    throttle: { low: '003d5450', mid: '003d5454', high: '003d5458' },
    brake: { low: '003d545c', mid: '003d5460', high: '003d5464' },
  },
};

const kr2Smoothing = { min: 0.00833, max: 0.04165, step: 0.00001, value: '0.01666', isInverse: true };
const txrd2Smoothing = { min: 0.003328, max: 0.06660, step: 0.00001, value: '0.01666', isInverse: true };

const kr2Addrs = {
  smoothing: '10171264', reduction: '0016caf0', reduction2: '0016caf4',
  dz: {
    steering: { low: '003deac4', mid: '003deac8', high: '003deacc' },
    throttle: { low: '003dea70', mid: '003dea74', high: '003dea78' },
    brake: { low: '003dea7c', mid: '003dea80', high: '003dea84' },
  },
};

const txrd2Addrs = {
  smoothing: '101713F4', reduction: '0016cc80', reduction2: '0016cc84',
  dz: {
    steering: { low: '003d6bc4', mid: '003d6bc8', high: '003d6bcc' },
    throttle: { low: '003d6b70', mid: '003d6b74', high: '003d6b78' },
    brake: { low: '003d6b7c', mid: '003d6b80', high: '003d6b84' },
  },
};

export const kb3: GameConfig = {
  id: 'kb3', label: 'Kaido Battle 3 (JP)', filename: 'SLPM-66022_EC33CA0D.pnach',
  group: 'Kaido Battle 3', fields: buildGroup(kb3Addrs),
};

export const kr2: GameConfig = {
  id: 'kr2', label: 'Kaido Racer 2 (EU)', filename: 'SLES-53900_C7993BCC.pnach',
  group: 'Kaido Battle 3',
  fields: [
    {
      id: 'smoothing', type: 'percent', label: 'Steering Smoothing',
      range: kr2Smoothing,
      patches: [{ address: kr2Addrs.smoothing, type: 'extended' as const, value: '{{smoothing_LO}}' }],
    },
    {
      id: 'reduction', type: 'percent', label: 'Steering Reduction Effect',
      range: reduction,
      patches: [
        { address: kr2Addrs.reduction, type: 'word' as const, value: '3C02{{reduction_LO}}' },
        { address: kr2Addrs.reduction2, type: 'word' as const, value: '44820800' },
      ],
    },
    ...dzFields(kr2Addrs.dz),
  ],
};

export const txrd2: GameConfig = {
  id: 'txrd2', label: 'TXR: Drift 2 (US)', filename: 'SLUS-21394_B32E018E.pnach',
  group: 'Kaido Battle 3',
  fields: [
    {
      id: 'smoothing', type: 'percent', label: 'Steering Smoothing',
      range: txrd2Smoothing,
      patches: [{ address: txrd2Addrs.smoothing, type: 'extended' as const, value: '{{smoothing_LO}}' }],
    },
    {
      id: 'reduction', type: 'percent', label: 'Steering Reduction Effect',
      range: reduction,
      patches: [
        { address: txrd2Addrs.reduction, type: 'word' as const, value: '3C02{{reduction_LO}}' },
        { address: txrd2Addrs.reduction2, type: 'word' as const, value: '44820800' },
      ],
    },
    ...dzFields(txrd2Addrs.dz),
  ],
};
