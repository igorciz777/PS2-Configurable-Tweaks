use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct PatchData {
    pub address: u32,
    pub length: String,
    pub data: u32,
}

pub fn parse_pnach(pnach_text: &str) -> Result<Vec<PatchData>, String> {
    let mut patches = Vec::new();

    for line in pnach_text.lines() {
        let line = line.trim();
        if line.is_empty() || line.starts_with('#') || line.starts_with("//") {
            continue;
        }

        if let Some(patch) = try_parse_line(line) {
            patches.push(patch);
        }
    }

    if patches.is_empty() {
        return Err("No patches found in pnach text".to_string());
    }

    Ok(patches)
}

fn try_parse_line(line: &str) -> Option<PatchData> {
    // Format 1 (PCSX2): patch=0,EE,address,type,value
    if let Some(rest) = line.strip_prefix("patch=") {
        let parts: Vec<&str> = rest.split(',').collect();
        if parts.len() >= 4 {
            let address_str = parts.get(2)?;
            let type_str = parts.get(3)?;
            let value_str = parts.get(4)?;

            let address = u32::from_str_hex(address_str).ok()?;
            let data = u32::from_str_hex(value_str).ok()?;

            return Some(PatchData {
                address,
                length: type_str.to_lowercase(),
                data,
            });
        }
    }

    // Format 2 (original PS2_Pnacher): patch,0,address,length,data
    if line.starts_with("patch") {
        let rest = line.strip_prefix("patch").unwrap_or(line);
        let rest = rest.strip_prefix(",").unwrap_or(rest);
        let parts: Vec<&str> = rest.split(',').collect();
        if parts.len() >= 4 {
            let address_str = parts.get(2)?;
            let length_str = parts.get(3)?;
            let data_str = parts.get(4)?;

            let address = u32::from_str_hex(address_str).ok()?;
            let data_str = data_str.split('/').next()?;
            let data = u32::from_str_hex(data_str).ok()?;

            return Some(PatchData {
                address,
                length: length_str.to_lowercase(),
                data,
            });
        }
    }

    None
}

fn data_size(length: &str, address: u32) -> usize {
    match length {
        "byte" | "_byte" => 1,
        "short" | "_short" => 2,
        "word" | "_word" => 4,
        "extended" | "_extended" => {
            if address & 0x20000000 != 0 {
                4
            } else if address & 0x10000000 != 0 {
                2
            } else {
                1
            }
        }
        _ => 4,
    }
}

trait FromStrHex {
    fn from_str_hex(s: &str) -> Result<u32, std::num::ParseIntError>;
}

impl FromStrHex for u32 {
    fn from_str_hex(s: &str) -> Result<u32, std::num::ParseIntError> {
        let s = s.trim();
        if s.starts_with("0x") || s.starts_with("0X") {
            u32::from_str_radix(&s[2..], 16)
        } else {
            u32::from_str_radix(s, 16)
        }
    }
}

pub fn get_patch_data_size(length: &str, address: u32) -> usize {
    data_size(length, address)
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct PatchLocation {
    pub offset: u64,
    pub value: u32,
    pub size: usize,
}
