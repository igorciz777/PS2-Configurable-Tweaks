import type { GameConfig, PatchLine, DeadzoneField } from '../../types/gameConfig';

const smoothing = { min: 0.0020825, max: 0.0625, step: 0.00001, value: '0.01666', isInverse: true };
const reduction = { min: 0, max: 7200, step: 100, value: '3600', isInverse: false };
const low = { min: 0, max: 1, step: 0.01, value: '0.1', isInverse: false };
const mid = { min: 0, max: 1, step: 0.01, value: '0.50', isInverse: false };
const high = { min: 0, max: 1, step: 0.01, value: '0.9', isInverse: false };

interface DzAddr {
  low: string; low2: string; mid: string; mid2: string;
  mml: string; mml2: string; hmm: string; hmm2: string;
  tbDisable?: string;
}

function dzFields(addrs: Record<string, DzAddr>): DeadzoneField[] {
  return Object.entries(addrs).map(([axis, a]) => {
    const cap = axis.charAt(0).toUpperCase() + axis.slice(1);
    const patches: PatchLine[] = [];
    if (a.tbDisable) patches.push({ address: a.tbDisable, type: 'word' as const, value: '00000000' });
    patches.push(
      { address: a.low, type: 'extended' as const, value: `{{${axis}Low_LO}}` },
      { address: a.low2, type: 'extended' as const, value: `{{${axis}Low_HI}}` },
      { address: a.mid, type: 'extended' as const, value: `{{${axis}Mid_LO}}` },
      { address: a.mid2, type: 'extended' as const, value: `{{${axis}Mid_HI}}` },
      { address: a.mml, type: 'extended' as const, value: `{{${axis}MidMinusLow_LO}}` },
      { address: a.mml2, type: 'extended' as const, value: `{{${axis}MidMinusLow_HI}}` },
      { address: a.hmm, type: 'extended' as const, value: `{{${axis}HighMinusMid_LO}}` },
      { address: a.hmm2, type: 'extended' as const, value: `{{${axis}HighMinusMid_HI}}` },
    );
    return {
      id: `${axis}Deadzone`, type: 'deadzone', label: `${cap} Deadzone`,
      axis, lowRange: low, midRange: mid, highRange: high, patches,
    };
  });
}

function buildGroup(baseFields: { smoothing: string; reduction: string; dz: Record<string, DzAddr> }) {
  return [
    {
      id: 'smoothing', type: 'percent' as const, label: 'Steering Smoothing',
      range: smoothing,
      patches: [{ address: baseFields.smoothing, type: 'extended' as const, value: '{{smoothing_LO}}' }],
    },
    {
      id: 'reduction', type: 'percent' as const, label: 'Steering Reduction Effect',
      range: reduction,
      patches: [{ address: baseFields.reduction, type: 'extended' as const, value: '{{reduction_LO}}' }],
    },
    ...dzFields(baseFields.dz),
  ];
}

const kb1Addrs = {
  smoothing: '10186630',
  reduction: '101A505C',
  dz: {
    steering: { low: '101AF4D0', low2: '101af4d4', mid: '101af4ec', mid2: '101af4fc', mml: '101af518', mml2: '101af51c', hmm: '101af548', hmm2: '101af550' },
    throttle: { low: '101af358', low2: '101af360', mid: '101af35c', mid2: '101af364', mml: '101af518', mml2: '101af51c', hmm: '101af548', hmm2: '101af550', tbDisable: '001af350' },
    brake: { low: '101af068', low2: '101af070', mid: '101af06c', mid2: '101af074', mml: '101af518', mml2: '101af51c', hmm: '101af548', hmm2: '101af550', tbDisable: '001af060' },
  },
};

const kb1krAddrs = {
  smoothing: '1018f9d0',
  reduction: '101b4340',
  dz: {
    steering: { low: '101bffc0', low2: '101bffc4', mid: '101bffec', mid2: '101bfff0', mml: '101c0010', mml2: '101c0014', hmm: '101c0048', hmm2: '101c004c' },
    throttle: { low: '101bfe28', low2: '101bfe2c', mid: '101bfe34', mid2: '101bfe38', mml: '101c0010', mml2: '101c0014', hmm: '101c0048', hmm2: '101c004c', tbDisable: '001bfe20' },
    brake: { low: '101bfaf8', low2: '101bfafc', mid: '101bfb04', mid2: '101bfb08', mml: '101c0010', mml2: '101c0014', hmm: '101c0048', hmm2: '101c004c', tbDisable: '001bfaf0' },
  },
};

const txrd1Addrs = {
  smoothing: '1015b1e4',
  reduction: '1017ccac',
  dz: {
    steering: { low: '101862f0', low2: '101862f4', mid: '1018630c', mid2: '10186310', mml: '1018632c', mml2: '10186330', hmm: '1018630c', hmm2: '10186310' },
    throttle: { low: '10186188', low2: '10186190', mid: '1018618c', mid2: '10186194', mml: '1018632c', mml2: '10186330', hmm: '1018630c', hmm2: '10186310', tbDisable: '00186180' },
    brake: { low: '10185ea8', low2: '10185eb0', mid: '10185eac', mid2: '10185eb4', mml: '1018632c', mml2: '10186330', hmm: '1018630c', hmm2: '10186310', tbDisable: '00185ea0' },
  },
};

export const kb1: GameConfig = {
  id: 'kb1', label: 'Kaido Battle 1 (JP)', filename: 'SLPM-65246_2046216F.pnach',
  group: 'Kaido Battle 1', fields: buildGroup(kb1Addrs),
};

export const kb1kr: GameConfig = {
  id: 'kb1kr', label: 'Kaido Battle 1 (KR)', filename: 'SLKA-25063_E3795E39.pnach',
  group: 'Kaido Battle 1', fields: buildGroup(kb1krAddrs),
};

export const txrd1: GameConfig = {
  id: 'txrd1', label: 'TXR: Drift (US)', filename: 'SLUS-21236_07A4E535.pnach',
  group: 'Kaido Battle 1', fields: buildGroup(txrd1Addrs),
};
