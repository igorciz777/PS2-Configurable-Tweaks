import type { GameConfig } from '../../types/gameConfig';

const smoothing = { min: 0.037916665, max: 1, step: 0.00001, value: '0.15166666', isInverse: true };
const reduction = { min: 0.0, max: 7.2, step: 0.1, value: '3.6', isInverse: false };
const low = { min: 0, max: 1, step: 0.01, value: '0.1', isInverse: false };
const mid = { min: 0, max: 1, step: 0.01, value: '0.50', isInverse: false };
const high = { min: 0, max: 1, step: 0.01, value: '0.9', isInverse: false };

function buildGroup(addrs: { smoothing: string; reduction: string; steeringLow: string; steeringLow2: string; steeringHigh: string; steeringHigh2: string }) {
  return [
    {
      id: 'smoothing', type: 'percent' as const, label: 'Steering Smoothing',
      range: smoothing,
      patches: [{ address: addrs.smoothing, type: 'word' as const, value: '{{smoothing}}' }],
    },
    {
      id: 'reduction', type: 'percent' as const, label: 'Steering Reduction Effect',
      range: reduction,
      patches: [{ address: addrs.reduction, type: 'extended' as const, value: '{{reduction_LO}}' }],
    },
    {
      id: 'steeringDeadzone', type: 'deadzone' as const, label: 'Steering Deadzone',
      axis: 'steering', lowRange: low, midRange: mid, highRange: high,
      patches: [
        { address: addrs.steeringLow, type: 'extended' as const, value: '{{steeringLow_LO}}' },
        { address: addrs.steeringLow2, type: 'extended' as const, value: '{{steeringLow_HI}}' },
        { address: addrs.steeringLow, type: 'extended' as const, value: '{{steeringLow_LO}}' },
        { address: addrs.steeringLow2 + '4', type: 'extended' as const, value: '{{steeringLow_HI}}' },
        { address: addrs.steeringHigh, type: 'extended' as const, value: '{{steeringHigh_LO}}' },
        { address: addrs.steeringHigh2, type: 'extended' as const, value: '{{steeringHigh_HI}}' },
        { address: addrs.steeringHigh + '30', type: 'extended' as const, value: '{{steeringHigh_LO}}' },
        { address: addrs.steeringHigh2 + '34', type: 'extended' as const, value: '{{steeringHigh_HI}}' },
      ],
    },
  ];
}

const sb01Addrs = {
  smoothing: '0032cdd8', reduction: '10272784',
  steeringLow: '1018ef9c', steeringLow2: '1018efa0',
  steeringHigh: '1018efa4', steeringHigh2: '1018efa8',
};

const txr3Addrs = {
  smoothing: '0032d258', reduction: '10272D14',
  steeringLow: '1018ebac', steeringLow2: '1018ebb0',
  steeringHigh: '1018ebb4', steeringHigh2: '1018ebb8',
};

export const sb01: GameConfig = {
  id: 'sb01', label: 'Shutokou Battle 01', filename: 'SLPM-65308_DD70E38F.pnach',
  group: 'Shutokou Battle 01', fields: buildGroup(sb01Addrs),
};

export const txr3: GameConfig = {
  id: 'txr3', label: 'Tokyo Xtreme Racer 3', filename: 'SLUS-20831_0F932D81.pnach',
  group: 'Shutokou Battle 01', fields: buildGroup(txr3Addrs),
};

export const txr3wf: GameConfig = {
  id: 'txr3wf', label: 'TXR3 (Whirlwind Fanfare fix)', filename: 'SLUS-20831_0F9348FF.pnach',
  group: 'Shutokou Battle 01', fields: buildGroup(txr3Addrs),
};
