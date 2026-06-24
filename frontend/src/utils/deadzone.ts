export function mapInput(x: number, LOW: number, MID: number, HIGH: number): number {
  if (x < LOW) return 0;
  if (x < MID) return ((x - LOW) / (MID - LOW)) * 0.5;
  if (x < HIGH) return ((x - MID) / (HIGH - MID)) * 0.5 + 0.5;
  return 1;
}

export function generateDeadzoneData(LOW: number, MID: number, HIGH: number): number[] {
  const ys: number[] = [];
  for (let i = 0; i <= 100; i++) {
    const x = i / 100;
    ys.push(mapInput(x, LOW, MID, HIGH));
  }
  return ys;
}
