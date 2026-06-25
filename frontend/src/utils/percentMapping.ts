interface PercentRange {
  min: number;
  max: number;
  value: string;
  isInverse: boolean;
}

export function getValueFromPercentage(
  range: PercentRange,
  percent: number,
  percentMax = 100,
): number {
  const { min, max } = range;
  const defaultVal = parseFloat(range.value);
  const clampedPercent = Math.min(Math.max(percent, 0), percentMax);
  const halfMax = 100;
  const isInverse = range.isInverse;

  if (!isInverse) {
    if (clampedPercent <= halfMax) {
      const ratio = clampedPercent / halfMax;
      return parseFloat((min + (defaultVal - min) * ratio).toFixed(8));
    }
    const ratio = (clampedPercent - halfMax) / halfMax;
    return parseFloat((defaultVal + (max - defaultVal) * ratio).toFixed(8));
  }

  if (clampedPercent <= halfMax) {
    const ratio = clampedPercent / halfMax;
    return parseFloat((max - (max - defaultVal) * ratio).toFixed(8));
  }
  const ratio = (clampedPercent - halfMax) / halfMax;
  return parseFloat((defaultVal - (defaultVal - min) * ratio).toFixed(8));
}

export function getPercentageFromValue(
  range: PercentRange,
  value: number,
): number {
  const { min, max } = range;
  const defaultVal = parseFloat(range.value);
  const clampedValue = Math.min(Math.max(value, min), max);
  const halfMax = 100;
  const isInverse = range.isInverse;

  if (!isInverse) {
    if (clampedValue <= defaultVal) {
      const denom = defaultVal - min;
      const pct = denom === 0 ? 0 : ((clampedValue - min) / denom) * halfMax;
      return parseFloat(pct.toFixed(8));
    }
    const denom = max - defaultVal;
    const pct = denom === 0 ? halfMax : halfMax + ((clampedValue - defaultVal) / denom) * halfMax;
    return parseFloat(pct.toFixed(8));
  }

  if (clampedValue >= defaultVal) {
    const denom = max - defaultVal;
    const pct = denom === 0 ? 0 : ((max - clampedValue) / denom) * halfMax;
    return parseFloat(pct.toFixed(8));
  }
  const denom = defaultVal - min;
  const pct = denom === 0 ? halfMax : halfMax + ((defaultVal - clampedValue) / denom) * halfMax;
  return parseFloat(pct.toFixed(8));
}
