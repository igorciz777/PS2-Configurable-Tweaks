import { useMemo } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale,
  PointElement, LineElement, Filler, Tooltip, Legend,
} from 'chart.js';
import { generateDeadzoneData } from '../utils/deadzone';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

interface DeadzoneChartProps {
  title: string;
  color: string;
  low: number;
  mid: number;
  high: number;
}

const chartStyle = {
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  background: 'rgba(14,16,38,0.4)',
  border: '1px solid rgba(80,90,160,0.1)',
  borderRadius: '8px',
  padding: '16px',
};
const titleStyle = {
  textAlign: 'center' as const,
  fontFamily: "'JetBrains Mono', monospace",
  fontSize: '0.55rem',
  fontWeight: 600,
  letterSpacing: '0.05em',
  color: '#6a6e94',
  textTransform: 'uppercase' as const,
  marginBottom: '12px',
};

export function DeadzoneChart({
  title, color, low, mid, high,
}: DeadzoneChartProps) {
  const data = useMemo(() => generateDeadzoneData(low, mid, high), [low, mid, high]);
  const labels = useMemo(() =>
    Array.from({ length: 101 }, (_, i) => parseFloat((i / 100).toFixed(2))), []);

  return (
    <div style={chartStyle}>
      <div style={titleStyle}>{title}</div>
      <div className="chart-card" style={{ flex: 1, minHeight: 0 }}>
        <Line
          data={{ labels, datasets: [{ data, borderColor: color, borderWidth: 1.5, pointRadius: 0, fill: false }] }}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            animation: false,
            scales: {
              x: { display: true, min: 0, max: 1, grid: { color: '#ffffff08' }, ticks: { color: '#6a6e94', font: { size: 8 } } },
              y: { display: true, min: 0, max: 1, grid: { color: '#ffffff08' }, ticks: { color: '#6a6e94', font: { size: 8 } } },
            },
            plugins: { legend: { display: false }, tooltip: { enabled: false } },
          }}
        />
      </div>
    </div>
  );
}
