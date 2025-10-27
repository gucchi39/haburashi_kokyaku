// ダッシュボード画面
import { Link } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { calculateWeekStats } from '../lib/stats';
import { Charts } from '../components/Charts';

export const DashboardPage = () => {
  const logs = useStore(state => state.logs);
  const stats = calculateWeekStats(logs);

  const StatCard = ({ label, value, comparison, unit = '' }: {
    label: string;
    value: number;
    comparison?: number;
    unit?: string;
  }) => (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{label}</p>
      <div className="flex items-baseline space-x-2">
        <p className="text-3xl font-bold text-gray-900 dark:text-white">
          {value.toFixed(comparison !== undefined ? 1 : 0)}{unit}
        </p>
        {comparison !== undefined && comparison !== 0 && (
          <span className={`text-sm font-semibold ${comparison > 0 ? 'text-green-600' : 'text-red-600'}`}>
            {comparison > 0 ? '↑' : '↓'} {Math.abs(comparison).toFixed(1)}
          </span>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <header className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">統計</h1>
          <Link
            to="/"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            ホーム
          </Link>
        </header>

        {/* 統計カード */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard
            label="今週の合計時間"
            value={stats.totalMinutes}
            comparison={stats.comparedToLastWeek.totalMinutes}
            unit="分"
          />
          <StatCard
            label="連続日数"
            value={stats.streak}
            unit="日"
          />
          <StatCard
            label="平均所要時間"
            value={stats.avgDuration}
            comparison={stats.comparedToLastWeek.avgDuration}
            unit="分"
          />
          <StatCard
            label="自己評価平均"
            value={stats.avgRating}
            comparison={stats.comparedToLastWeek.avgRating}
            unit="★"
          />
        </div>

        {/* 朝晩カバー率 */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow mb-8">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">朝晩カバー率</p>
          <div className="flex items-center space-x-4">
            <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-4">
              <div
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-4 rounded-full transition-all"
                style={{ width: `${stats.morningNightCoverage}%` }}
              />
            </div>
            <span className="text-lg font-bold text-gray-900 dark:text-white">
              {stats.morningNightCoverage.toFixed(0)}%
            </span>
          </div>
        </div>

        {/* グラフ */}
        <Charts logs={logs} />
      </div>
    </div>
  );
};
