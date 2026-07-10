mod pnach;
mod elf;
mod iso9660;
mod patcher;

use wasm_bindgen::prelude::*;
use serde::Serialize;

#[wasm_bindgen]
pub fn parse_pnach(pnach_text: &str) -> Result<JsValue, JsValue> {
    let patches = pnach::parse_pnach(pnach_text)
        .map_err(|e| JsValue::from_str(&e))?;
    serde_to_js(&patches)
}

#[wasm_bindgen]
pub fn find_elf_offset(iso_data: &[u8]) -> Result<JsValue, JsValue> {
    let elf_info = iso9660::find_elf_in_iso(iso_data)
        .map_err(|e| JsValue::from_str(&e))?;
    serde_to_js(&elf_info)
}

#[wasm_bindgen]
pub fn analyze_elf(iso_data: &[u8], elf_offset: u64) -> Result<JsValue, JsValue> {
    let elf_start = elf_offset as usize;
    if elf_start + 52 > iso_data.len() {
        return Err(JsValue::from_str("ISO data too small for ELF at given offset"));
    }
    let elf_data = &iso_data[elf_start..];
    let info = elf::parse_elf_header(elf_data)
        .map_err(|e| JsValue::from_str(&e))?;
    serde_to_js(&info)
}

#[wasm_bindgen]
pub fn compute_iso_patches(
    iso_data: &[u8],
    pnach_text: &str,
) -> Result<JsValue, JsValue> {
    // Step 1: Parse pnach
    let patches = pnach::parse_pnach(pnach_text)
        .map_err(|e| JsValue::from_str(&e))?;

    // Step 2: Find ELF in ISO
    let elf_file = iso9660::find_elf_in_iso(iso_data)
        .map_err(|e| JsValue::from_str(&e))?;

    // Step 3: Parse ELF header
    let elf_start = elf_file.offset as usize;
    if elf_start + 52 > iso_data.len() {
        return Err(JsValue::from_str("ISO data too small for ELF at found offset"));
    }
    let elf_data = &iso_data[elf_start..];
    let elf_info = elf::parse_elf_header(elf_data)
        .map_err(|e| JsValue::from_str(&e))?;

    // Step 4: Compute patch locations
    let locations = patcher::compute_patch_locations(&patches, &elf_info, elf_file.offset);

    if locations.is_empty() {
        return Err(JsValue::from_str("No patches could be applied"));
    }

    serde_to_js(&serde_json::json!({
        "patches": locations,
        "elf_offset": elf_file.offset,
    }))
}

fn serde_to_js<T: Serialize>(val: &T) -> Result<JsValue, JsValue> {
    serde_json::to_string(val)
        .map(|s| JsValue::from_str(&s))
        .map_err(|e| JsValue::from_str(&e.to_string()))
}
