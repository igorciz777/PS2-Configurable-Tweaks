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

export function DeadzoneChart({
  title, color, low, mid, high,
}: DeadzoneChartProps) {
  const data = useMemo(() => generateDeadzoneData(low, mid, high), [low, mid, high]);
  const labels = useMemo(() =>
    Array.from({ length: 101 }, (_, i) => parseFloat((i / 100).toFixed(2))), []);

  return (
    <div className="chart-card">
      <div className="chart-title">{title}</div>
      <Line
        data={{ labels, datasets: [{ data, borderColor: color, borderWidth: 2, pointRadius: 0, fill: false }] }}
        options={{
          responsive: true,
          animation: false,
          aspectRatio: 1,
          scales: {
            x: { display: true, min: 0, max: 1, grid: { color: '#ffffff15' }, ticks: { color: '#8888aa' } },
            y: { display: true, min: 0, max: 1, grid: { color: '#ffffff15' }, ticks: { color: '#8888aa' } },
          },
          plugins: { legend: { display: false }, tooltip: { enabled: false } },
        }}
      />
    </div>
  );
}
