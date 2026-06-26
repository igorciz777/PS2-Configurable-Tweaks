import { useState, useMemo } from 'react';
import type { FieldConfig, TweakValues, TweakValue } from '../fields';
import { FieldRenderer } from './fields/FieldRenderer';

interface TagGroupProps {
  fields: FieldConfig[];
  values: TweakValues;
  onSetValue: (key: string, value: TweakValue) => void;
  getPercent: (fieldId: string) => number;
  onUpdatePercent: (fieldId: string, pct: number) => void;
}

interface TreeNode {
  label: string;
  fullPath: string;
  fields: FieldConfig[];
  children: TreeNode[];
}

function buildTree(fields: FieldConfig[]): { roots: TreeNode[]; ungrouped: FieldConfig[] } {
  const roots: TreeNode[] = [];
  const ungrouped: FieldConfig[] = [];

  for (const f of fields) {
    const tag = f.tag;
    if (!tag) {
      ungrouped.push(f);
      continue;
    }
    const parts = tag.split('/').map(s => s.trim()).filter(Boolean);
    if (parts.length === 0) {
      ungrouped.push(f);
      continue;
    }
    let currentLevel = roots;
    let accumulated = '';
    for (let i = 0; i < parts.length; i++) {
      accumulated = accumulated ? `${accumulated}/${parts[i]}` : parts[i];
      let node = currentLevel.find(n => n.label === parts[i]);
      if (!node) {
        node = { label: parts[i], fullPath: accumulated, fields: [], children: [] };
        currentLevel.push(node);
      }
      if (i === parts.length - 1) {
        node.fields.push(f);
      }
      currentLevel = node.children;
    }
  }
  return { roots, ungrouped };
}

const groupBorder = '1px solid rgba(80,90,160,0.12)';
const groupBorderHover = '1px solid rgba(80,90,160,0.2)';
const headerBg = 'rgba(14,16,38,0.3)';
const headerBorder = '1px solid rgba(80,90,160,0.1)';

function TreeNodeRow({
  node, values, onSetValue, getPercent, onUpdatePercent, depth,
}: {
  node: TreeNode;
  values: TweakValues;
  onSetValue: (key: string, value: TweakValue) => void;
  getPercent: (fieldId: string) => number;
  onUpdatePercent: (fieldId: string, pct: number) => void;
  depth: number;
}) {
  const [open, setOpen] = useState(true);
  const hasContent = node.fields.length > 0 || node.children.length > 0;
  if (!hasContent) return null;

  return (
    <div
      className="overflow-hidden transition-colors rounded-xl"
      style={{ border: groupBorder }}
      onMouseEnter={e => { e.currentTarget.style.border = groupBorderHover; }}
      onMouseLeave={e => { e.currentTarget.style.border = groupBorder; }}
    >
      <div
        className="flex items-center gap-2.5 px-5 py-3 border-b cursor-pointer select-none transition-colors"
        style={{ paddingLeft: `${16 + depth * 16}px`, background: headerBg, borderBottom: headerBorder }}
        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(74,125,255,0.03)'; }}
        onMouseLeave={e => { e.currentTarget.style.background = headerBg; }}
        onClick={() => setOpen(!open)}
      >
        <span
          className="transition-transform duration-150"
          style={{
            color: open ? '#4a7dff' : '#6a6e94',
            fontSize: '0.45rem',
            transform: open ? 'rotate(0deg)' : 'rotate(-90deg)',
          }}
        >
          ▼
        </span>
        <span
          className="text-sm font-semibold uppercase tracking-wider"
          style={{ color: '#c0c4d8' }}
        >
          {node.label}
        </span>
      </div>

      {open && (
        <div style={{ padding: '14px 14px 10px 14px' }}>
          <div className="space-y-3">
            {node.fields.map(field => (
              <FieldRenderer
                key={field.id}
                field={field}
                values={values}
                onSetValue={onSetValue}
                getPercent={getPercent}
                onUpdatePercent={onUpdatePercent}
              />
            ))}
            {node.children.map(child => (
              <TreeNodeRow
                key={child.fullPath}
                node={child}
                values={values}
                onSetValue={onSetValue}
                getPercent={getPercent}
                onUpdatePercent={onUpdatePercent}
                depth={depth + 1}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export function TagGroup(props: TagGroupProps) {
  const { fields, values, onSetValue, getPercent, onUpdatePercent } = props;
  const { roots, ungrouped } = useMemo(() => buildTree(fields), [fields]);

  return (
    <div className="space-y-3">
      {roots.map(root => (
        <TreeNodeRow
          key={root.fullPath}
          node={root}
          values={values}
          onSetValue={onSetValue}
          getPercent={getPercent}
          onUpdatePercent={onUpdatePercent}
          depth={0}
        />
      ))}
      {ungrouped.map(field => (
        <FieldRenderer
          key={field.id}
          field={field}
          values={values}
          onSetValue={onSetValue}
          getPercent={getPercent}
          onUpdatePercent={onUpdatePercent}
        />
      ))}
    </div>
  );
}
