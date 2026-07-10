use serde::{Deserialize, Serialize};

const SECTOR_SIZE: u64 = 2048;
const PVD_SECTOR: u64 = 16;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ElfFileInfo {
    pub offset: u64,
    pub size: u32,
}

fn read_u32_le(data: &[u8], offset: usize) -> u32 {
    u32::from_le_bytes([
        data[offset],
        data[offset + 1],
        data[offset + 2],
        data[offset + 3],
    ])
}

pub fn find_elf_in_iso(iso_data: &[u8]) -> Result<ElfFileInfo, String> {
    if iso_data.len() < (PVD_SECTOR as usize + 1) * SECTOR_SIZE as usize {
        return Err("ISO data too small".to_string());
    }

    // Read Primary Volume Descriptor at sector 16
    let pvd_offset = (PVD_SECTOR * SECTOR_SIZE) as usize;
    let pvd = &iso_data[pvd_offset..];

    if pvd[0] != 1 || &pvd[1..6] != b"CD001" {
        return Err("Invalid Primary Volume Descriptor".to_string());
    }

    // Root Directory Record starts at offset 156 in PVD
    // Location of Extent: LE bytes at offset 158 (2 + 4 bytes)
    let root_extent = read_u32_le(pvd, 158);
    let root_size = read_u32_le(pvd, 166);

    // Read root directory
    let root_offset = (root_extent as u64) * SECTOR_SIZE;
    let root_start = root_offset as usize;
    let root_end = root_start + root_size as usize;

    if root_end > iso_data.len() {
        return Err("Root directory extends beyond ISO".to_string());
    }

    let root_data = &iso_data[root_start..root_end];
    parse_directory_entries(root_data, root_extent, iso_data)
}

fn parse_directory_entries(
    dir_data: &[u8],
    _dir_extent: u32,
    iso_data: &[u8],
) -> Result<ElfFileInfo, String> {
    let mut offset: usize = 0;

    while offset < dir_data.len() {
        let entry_len = dir_data[offset] as usize;
        if entry_len == 0 {
            offset += 1;
            continue;
        }

        if offset + 33 > dir_data.len() {
            break;
        }

        let file_flags = dir_data[offset + 25];
        let name_len = dir_data[offset + 32] as usize;

        if offset + 33 + name_len > dir_data.len() {
            break;
        }

        let name_bytes = &dir_data[offset + 33..offset + 33 + name_len];

        // Check if this is an ELF file matching PS2 naming convention:
        // 13 chars, starts with s/S, 4th char is '_'
        let is_ps2_elf = is_ps2_elf_name(name_bytes);

        if is_ps2_elf {
            let file_extent = read_u32_le(dir_data, offset + 2);
            let file_size = read_u32_le(dir_data, offset + 10);
            let file_offset = (file_extent as u64) * SECTOR_SIZE;

            return Ok(ElfFileInfo {
                offset: file_offset,
                size: file_size,
            });
        }

        // If this is a subdirectory (not . or ..), recurse into it
        if file_flags & 0x02 != 0 && name_len > 0 && !is_dot_or_dotdot(name_bytes) {
            let sub_extent = read_u32_le(dir_data, offset + 2);
            let sub_size = read_u32_le(dir_data, offset + 10);
            let sub_offset = (sub_extent as u64) * SECTOR_SIZE;
            let sub_start = sub_offset as usize;
            let sub_end = sub_start + sub_size as usize;

            if sub_end <= iso_data.len() {
                if let Ok(info) =
                    parse_directory_entries(&iso_data[sub_start..sub_end], sub_extent, iso_data)
                {
                    return Ok(info);
                }
            }
        }

        offset += entry_len;
    }

    Err("PS2 ELF file not found in ISO".to_string())
}

fn is_ps2_elf_name(name: &[u8]) -> bool {
    if name.len() != 13 {
        return false;
    }

    // First char: s or S
    if name[0] != b's' && name[0] != b'S' {
        return false;
    }

    // 4th char (index 3): '_'
    if name[4] != b'_' {
        return false;
    }

    // Chars 5-7: digits
    for i in 5..=7 {
        if !name[i].is_ascii_digit() {
            return false;
        }
    }

    // Char 8: '.'
    if name[8] != b'.' {
        return false;
    }

    // Chars 9-10: digits
    for i in 9..=10 {
        if !name[i].is_ascii_digit() {
            return false;
        }
    }

    true
}

fn is_dot_or_dotdot(name: &[u8]) -> bool {
    name == b"." || name == b".." || name == b"\x00"
}
