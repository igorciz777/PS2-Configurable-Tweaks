import type { FieldConfig } from '../fields';
import type { TweakValues } from '../fields';

interface GroupedField {
  tag: string;
  comment: string;
  author: string;
  patches: string[];
}

function extractSerial(filename: string): string {
  return filename.replace(/\.pnach$/, '');
}

export function generatePnach(
  fields: FieldConfig[],
  values: TweakValues,
  gameLabel: string,
  filename: string,
): string {
  const serial = extractSerial(filename);
  const lines: string[] = [];

  lines.push(`gametitle=${gameLabel} (${serial})`);
  lines.push('');

  const groups = new Map<string, GroupedField>();

  for (const field of fields) {
    const raw = field.generatePatches(values);
    const patchLines = raw.map(p => `patch=0,EE,${p.address},${p.type},${p.value}`);
    if (patchLines.length === 0) continue;

    const tag = field.tag || field.id;

    if (groups.has(tag)) {
      const g = groups.get(tag)!;
      g.patches.push(...patchLines);
    } else {
      groups.set(tag, {
        tag,
        comment: field.comment,
        author: field.author,
        patches: patchLines,
      });
    }
  }

  let first = true;
  for (const [, g] of groups) {
    if (!first) lines.push('');
    first = false;

    lines.push(`[${g.tag}]`);
    if (g.comment) lines.push(`description=${g.comment}`);
    if (g.author) lines.push(`author=${g.author}`);
    lines.push(...g.patches);
  }

  return lines.join('\n');
}
