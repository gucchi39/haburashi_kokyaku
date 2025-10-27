// グラフコンポーネント
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import type { ChartOptions } from 'chart.js';
import type { BrushLog } from '../types';

// Chart.js登録
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface ChartsProps {
  logs: BrushLog[];
}

export const Charts: React.FC<ChartsProps> = ({ logs }) => {
  // 最近7日間のデータを準備
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    return date.toISOString().split('T')[0];
  });

  const dailyData = last7Days.map(dateStr => {
    const dayLogs = logs.filter(log => log.dateISO.startsWith(dateStr));
    const totalMinutes = dayLogs.reduce((sum, log) => sum + log.durationSec / 60, 0);
    const avgRating = dayLogs.length > 0
      ? dayLogs.reduce((sum, log) => sum + log.selfRating, 0) / dayLogs.length
      : 0;
    return { date: dateStr, totalMinutes, avgRating, count: dayLogs.length };
  });

  const labels = last7Days.map(date => {
    const d = new Date(date);
    return `${d.getMonth() + 1}/${d.getDate()}`;
  });

  // 所要時間のグラフデータ
  const durationData = {
    labels,
    datasets: [
      {
        label: '合計時間（分）',
        data: dailyData.map(d => d.totalMinutes),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.3,
      },
    ],
  };

  // 回数のグラフデータ
  const countData = {
    labels,
    datasets: [
      {
        label: '回数',
        data: dailyData.map(d => d.count),
        backgroundColor: 'rgba(34, 197, 94, 0.8)',
      },
    ],
  };

  const lineOptions: ChartOptions<'line'> = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  const barOptions: ChartOptions<'bar'> = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
    },
  };

  return (
    <div className="space-y-6">
      {/* 所要時間の推移 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          所要時間の推移（最近7日間）
        </h3>
        <Line data={durationData} options={lineOptions} />
      </div>

      {/* 歯みがき回数 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          歯みがき回数（最近7日間）
        </h3>
        <Bar data={countData} options={barOptions} />
      </div>
    </div>
  );
};
