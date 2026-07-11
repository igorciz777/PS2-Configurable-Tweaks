import init, {
  compute_iso_patches,
  find_elf_offset as wasmFindElfOffset,
  analyze_elf as wasmAnalyzeElf,
  parse_pnach as wasmParsePnach,
} from './wasm/wasm_patcher.js';

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

export interface ElfFileInfo {
  offset: number;
  size: number;
}

export interface ProgramHeader {
  typ: number;
  offset: number;
  virt_addr: number;
  phys_addr: number;
  file_size: number;
  mem_size: number;
  flags: number;
  align: number;
}

export interface ElfInfo {
  entry: number;
  ph_offset: number;
  ph_entry_size: number;
  ph_num: number;
  program_headers: ProgramHeader[];
}

export interface ParsedPatch {
  address: number;
  length: string;
  data: number;
}

export function runComputePatches(isoData: Uint8Array, pnachText: string): PatchResult {
  const resultJson = compute_iso_patches(isoData, pnachText);
  return JSON.parse(resultJson);
}

export function findElfOffset(isoData: Uint8Array): ElfFileInfo {
  const resultJson = wasmFindElfOffset(isoData);
  return JSON.parse(resultJson);
}

export function analyzeElf(isoData: Uint8Array, elfOffset: number): ElfInfo {
  const resultJson = wasmAnalyzeElf(isoData, BigInt(elfOffset));
  return JSON.parse(resultJson);
}

export function parsePnach(pnachText: string): ParsedPatch[] {
  const resultJson = wasmParsePnach(pnachText);
  return JSON.parse(resultJson);
}

export { compute_iso_patches };
