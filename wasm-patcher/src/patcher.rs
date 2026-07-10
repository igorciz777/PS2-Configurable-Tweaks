use crate::elf::ElfInfo;
use crate::pnach::{PatchData, PatchLocation};
use crate::pnach;

pub fn compute_patch_locations(
    patches: &[PatchData],
    elf_info: &ElfInfo,
    elf_offset: u64,
) -> Vec<PatchLocation> {
    let mut locations = Vec::new();

    for patch in patches {
        let size = pnach::get_patch_data_size(&patch.length, patch.address);
        let adjusted_address = patch.address & 0x0FFF_FFFF;

        let mut found = false;
        for ph in &elf_info.program_headers {
            let ph_start = ph.virt_addr;
            let ph_end = ph.virt_addr + ph.file_size;

            if ph_start <= adjusted_address && ph_end > adjusted_address + (size as u32) {
                let file_offset = elf_offset
                    + ph.offset as u64
                    + (adjusted_address - ph.virt_addr) as u64;

                locations.push(PatchLocation {
                    offset: file_offset,
                    value: patch.data,
                    size,
                });
                found = true;
                break;
            }
        }

        if !found {
            eprintln!(
                "Could not patch at address 0x{:08X}",
                patch.address
            );
        }
    }

    locations
}
