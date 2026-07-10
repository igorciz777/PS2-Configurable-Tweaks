use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ProgramHeader {
    pub typ: u32,
    pub offset: u32,
    pub virt_addr: u32,
    pub phys_addr: u32,
    pub file_size: u32,
    pub mem_size: u32,
    pub flags: u32,
    pub align: u32,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ElfInfo {
    pub entry: u32,
    pub ph_offset: u32,
    pub ph_entry_size: u16,
    pub ph_num: u16,
    pub program_headers: Vec<ProgramHeader>,
}

pub fn parse_elf_header(data: &[u8]) -> Result<ElfInfo, String> {
    if data.len() < 52 {
        return Err("Data too short for ELF header".to_string());
    }

    if data[1] != b'E' || data[2] != b'L' || data[3] != b'F' {
        return Err("Invalid ELF magic".to_string());
    }

    if data[4] != 1 {
        return Err("Not a 32-bit ELF".to_string());
    }

    let machine = u16::from_le_bytes([data[18], data[19]]);
    if machine != 8 {
        return Err("Not a MIPS ELF (machine != 8)".to_string());
    }

    let entry = u32::from_le_bytes([data[24], data[25], data[26], data[27]]);
    let ph_offset = u32::from_le_bytes([data[28], data[29], data[30], data[31]]);
    let ph_entry_size = u16::from_le_bytes([data[42], data[43]]);
    let ph_num = u16::from_le_bytes([data[44], data[45]]);

    let mut program_headers = Vec::with_capacity(ph_num as usize);
    let ph_end = (ph_offset as usize) + (ph_num as usize) * (ph_entry_size as usize);

    if data.len() < ph_end {
        return Err("Data too short for program headers".to_string());
    }

    for i in 0..ph_num as usize {
        let base = ph_offset as usize + i * ph_entry_size as usize;
        if base + 32 > data.len() {
            return Err("Program header extends beyond data".to_string());
        }

        let ph = ProgramHeader {
            typ: u32::from_le_bytes([data[base], data[base + 1], data[base + 2], data[base + 3]]),
            offset: u32::from_le_bytes([data[base + 4], data[base + 5], data[base + 6], data[base + 7]]),
            virt_addr: u32::from_le_bytes([data[base + 8], data[base + 9], data[base + 10], data[base + 11]]),
            phys_addr: u32::from_le_bytes([data[base + 12], data[base + 13], data[base + 14], data[base + 15]]),
            file_size: u32::from_le_bytes([data[base + 16], data[base + 17], data[base + 18], data[base + 19]]),
            mem_size: u32::from_le_bytes([data[base + 20], data[base + 21], data[base + 22], data[base + 23]]),
            flags: u32::from_le_bytes([data[base + 24], data[base + 25], data[base + 26], data[base + 27]]),
            align: u32::from_le_bytes([data[base + 28], data[base + 29], data[base + 30], data[base + 31]]),
        };
        program_headers.push(ph);
    }

    Ok(ElfInfo {
        entry,
        ph_offset,
        ph_entry_size,
        ph_num,
        program_headers,
    })
}
