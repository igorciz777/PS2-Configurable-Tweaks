export function floatToHex(floatValue: number, subStart: number, subEnd: number): string {
  const buffer = new ArrayBuffer(4);
  const view = new DataView(buffer);
  view.setFloat32(0, floatValue, false);

  let hex = view.getUint32(0).toString(16).toUpperCase();

  if (hex === '0') {
    return '00000000'.substring(subStart, subEnd);
  }

  return hex.substring(subStart, subEnd);
}
