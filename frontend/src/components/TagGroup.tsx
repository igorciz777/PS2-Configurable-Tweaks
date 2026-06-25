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

function TreeNodeRow({
  node,
  values, onSetValue, getPercent, onUpdatePercent,
  depth,
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
    <div className="tag-group">
      <div
        className="tag-group-header"
        style={{ paddingLeft: `${12 + depth * 16}px` }}
        onClick={() => setOpen(!open)}
      >
        <span className={`tag-group-arrow ${open ? 'open' : ''}`}>
          {open ? '▼' : '▶'}
        </span>
        <span className="tag-group-label">{node.label}</span>
      </div>

      {open && (
        <div className="tag-group-body">
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
      )}
    </div>
  );
}

export function TagGroup(props: TagGroupProps) {
  const { fields, values, onSetValue, getPercent, onUpdatePercent } = props;

  const { roots, ungrouped } = useMemo(() => buildTree(fields), [fields]);

  return (
    <>
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
    </>
  );
}
