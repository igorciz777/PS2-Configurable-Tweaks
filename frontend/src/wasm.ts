import init, { compute_iso_patches } from './wasm/wasm_patcher.js';

let wasmReady = false;
let wasmInitPromise: Promise<void> | null = null;

export async function ensureWasm(): Promise<void> {
  if (wasmReady) return;
  if (!wasmInitPromise) {
    wasmInitPromise = init().then(() => { wasmReady = true; });
  }
  await wasmInitPromise;
}

export interface PatchInfo {
  offset: number;
  value: number;
  size: number;
}

export interface PatchResult {
  patches: PatchInfo[];
  elf_offset: number;
}

export function runComputePatches(isoData: Uint8Array, pnachText: string): PatchResult {
  const resultJson = compute_iso_patches(isoData, pnachText);
  return JSON.parse(resultJson);
}

export { compute_iso_patches };
