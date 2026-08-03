import type { ReactNode } from 'react';
import { VectorInput } from './VectorInput';

interface TransformFieldCardProps {
  label: string;
  helpEl?: ReactNode;
  min: number;
  max: number;
  step: number;
  x: number;
  y: number;
  z: number;
  onXChange: (v: number) => void;
  onYChange: (v: number) => void;
  onZChange: (v: number) => void;
}

export function TransformFieldCard(props: TransformFieldCardProps) {
  return <VectorInput {...props} />;
}
