import { useMemo } from 'react';
import type { FieldConfig, TweakValues, TweakValue } from '../fields';
import type { CameraConfig } from '../config/games';
import { FieldRenderer } from './fields/FieldRenderer';
import { CameraPreview } from './CameraPreview';

interface CameraGroupProps {
  cameras: CameraConfig[];
  activeCamera: string;
  onCameraChange: (id: string) => void;
  fields: FieldConfig[];
  values: TweakValues;
  onSetValue: (key: string, value: TweakValue) => void;
  getPercent: (fieldId: string) => number;
  onUpdatePercent: (fieldId: string, pct: number) => void;
}

const groupBorder = '1px solid rgba(80,90,160,0.12)';
const headerBg = 'rgba(14,16,38,0.3)';
const headerBorder = '1px solid rgba(80,90,160,0.1)';
const tabRowStyle: React.CSSProperties = {
  display: 'flex',
  gap: '2px',
  padding: '0 16px',
  background: 'rgba(14,16,38,0.2)',
  borderBottom: '1px solid rgba(80,90,160,0.08)',
};

export function CameraGroup({
  cameras,
  activeCamera,
  onCameraChange,
  fields,
  values,
  onSetValue,
  getPercent,
  onUpdatePercent,
}: CameraGroupProps) {
  const fieldsById = useMemo(() => {
    const map = new Map<string, FieldConfig>();
    for (const f of fields) map.set(f.id, f);
    return map;
  }, [fields]);

  const camIndex = cameras.findIndex(c => c.id === activeCamera);
  const currentFields = cameras[camIndex]?.fieldIds
    .map((id: string) => fieldsById.get(id))
    .filter((f): f is FieldConfig => f != null) ?? [];

  const previewFallbacks = useMemo(() => {
    const result: Record<string, [number, number, number]> = {};
    for (const f of currentFields) {
      if (f.type === 'transform') {
        const tf = f as FieldConfig & { default: [number, number, number] };
        result[f.id] = tf.default;
      }
    }
    return result;
  }, [currentFields]);

  return (
    <div
      className="overflow-hidden transition-colors rounded-xl"
      style={{ border: groupBorder }}
    >
      <div
        className="flex items-center gap-2.5 px-5 py-3"
        style={{ background: headerBg, borderBottom: headerBorder }}
      >
        <span className="text-sm font-semibold uppercase tracking-wider" style={{ color: '#c0c4d8' }}>
          Camera
        </span>
      </div>

      <div style={tabRowStyle}>
        {cameras.map((cam) => (
          <button
            key={cam.id}
            onClick={() => onCameraChange(cam.id)}
            className="text-xs font-semibold uppercase tracking-wider px-3 py-2 transition-colors"
            style={{
              color: cam.id === activeCamera ? '#4a7dff' : '#6a6e94',
              borderBottom: cam.id === activeCamera ? '2px solid #4a7dff' : '2px solid transparent',
              background: cam.id === activeCamera ? 'rgba(74,125,255,0.05)' : 'transparent',
            }}
          >
            {cam.label}
          </button>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center gap-4" style={{ minHeight: '240px' }}>
        <div className="sm:w-[40%]" style={{ padding: '16px' }}>
          <div className="grid grid-cols-1 sm:grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-3">
            {currentFields.map((field: FieldConfig) => (
              <div key={field.id} style={(field.type === 'deadzone' || field.type === 'transform') ? { gridColumn: '1 / -1' } : undefined}>
                <FieldRenderer
                  field={field}
                  values={values}
                  onSetValue={onSetValue}
                  getPercent={getPercent}
                  onUpdatePercent={onUpdatePercent}
                  activeCamera={activeCamera}
                />
              </div>
            ))}
          </div>
        </div>

        <div
          style={{ width: '70%', padding: '16px' }}
        >
          <div style={{ width: '100%', aspectRatio: '4 / 3' }}>
            <CameraPreview
              prefix={activeCamera}
              values={values}
              fallbacks={previewFallbacks}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
