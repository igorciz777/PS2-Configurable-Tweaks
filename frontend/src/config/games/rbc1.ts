import type { GameConfig, DeadzoneField } from '../../types/gameConfig';

const smoothing = { min: 1, max: 60, step: 1, value: '30', isInverse: false };
const reduction = { min: 0.0, max: 7.2, step: 0.1, value: '3.6', isInverse: false };
const low = { min: 0, max: 1, step: 0.01, value: '0.1', isInverse: false };
const mid = { min: 0, max: 1, step: 0.01, value: '0.50', isInverse: false };
const high = { min: 0, max: 1, step: 0.01, value: '0.9', isInverse: false };

interface DzAddr { low: string; high: string; }

function dzFields(addrs: Record<string, DzAddr>): DeadzoneField[] {
  return Object.entries(addrs).map(([axis, a]) => {
    const cap = axis.charAt(0).toUpperCase() + axis.slice(1);
    return {
      id: `${axis}Deadzone`, type: 'deadzone', label: `${cap} Deadzone`,
      axis, lowRange: low, midRange: mid, highRange: high,
      patches: [
        { address: a.low, type: 'word' as const, value: `{{${axis}Low}}` },
        { address: a.high, type: 'word' as const, value: `{{${axis}High}}` },
      ],
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

const rbc1Addrs = {
  smoothing: '1020C0CC', reduction: '101761a4',
  dz: {
    steering: { low: '0049da00', high: '0049da08' },
    throttle: { low: '0049da10', high: '0049da18' },
    brake: { low: '0049da20', high: '0049da28' },
  },
};

export const rbc1: GameConfig = {
  id: 'rbc1', label: 'Racing Battle C1 Grand Prix', filename: 'SLPM-65897_1C087362.pnach',
  group: 'RACING BATTLE C1 Grand Prix', fields: buildGroup(rbc1Addrs),
};

export const rbc1tl: GameConfig = {
  id: 'rbc1tl', label: 'RB C1GP English Patch', filename: 'SLPM-65897_9C4C9611.pnach',
  group: 'RACING BATTLE C1 Grand Prix', fields: buildGroup(rbc1Addrs),
};
