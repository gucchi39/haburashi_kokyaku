// 設定画面
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../store/useStore';

export const SettingsPage = () => {
  const { profile, updateProfile, exportData, importData, clearAllData } = useStore();
  const [importError, setImportError] = useState('');

  const handleReminderToggle = () => {
    updateProfile({
      reminders: {
        ...profile.reminders,
        enabled: !profile.reminders.enabled,
      },
    });
  };

  const handleTimeChange = (type: 'morning' | 'night', value: string) => {
    updateProfile({
      reminders: {
        ...profile.reminders,
        [type]: value,
      },
    });
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        try {
          importData(reader.result as string);
          setImportError('');
          alert('インポートが完了しました！');
        } catch (error) {
          setImportError((error as Error).message);
        }
      };
      reader.readAsText(file);
    }
  };

  const handleClearData = () => {
    if (confirm('すべてのデータを削除しますか？この操作は取り消せません。')) {
      clearAllData();
      alert('データを削除しました');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <header className="flex items-center justify-between mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">設定</h1>
          <Link
            to="/"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition text-lg"
          >
            ホーム
          </Link>
        </header>

        <div className="max-w-3xl mx-auto space-y-6">
          {/* リマインダー */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              リマインダー
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              ⚠️ アプリ起動中のみ通知されます（デモ用）
            </p>

            <label className="flex items-center space-x-3 mb-4 cursor-pointer">
              <input
                type="checkbox"
                checked={profile.reminders.enabled}
                onChange={handleReminderToggle}
                className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-gray-700 dark:text-gray-300">リマインダーを有効にする</span>
            </label>

            {profile.reminders.enabled && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                    朝の時刻
                  </label>
                  <input
                    type="time"
                    value={profile.reminders.morning || ''}
                    onChange={(e) => handleTimeChange('morning', e.target.value)}
                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                    夜の時刻
                  </label>
                  <input
                    type="time"
                    value={profile.reminders.night || ''}
                    onChange={(e) => handleTimeChange('night', e.target.value)}
                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>
            )}
          </div>

          {/* 目標 */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              目標
            </h2>
            <p className="text-gray-700 dark:text-gray-300">
              1日{profile.goal.dailyTarget}回、合計{profile.goal.minutesPerDay}分
            </p>
          </div>

          {/* データ入出力 */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              データ管理
            </h2>
            
            <div className="space-y-3">
              <button
                onClick={exportData}
                className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
              >
                📥 データをエクスポート
              </button>

              <div>
                <label className="block w-full px-4 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition cursor-pointer text-center">
                  📤 データをインポート
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleImport}
                    className="hidden"
                  />
                </label>
                {importError && (
                  <p className="mt-2 text-sm text-red-600">{importError}</p>
                )}
              </div>

              <button
                onClick={handleClearData}
                className="w-full px-4 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition"
              >
                🗑️ すべてのデータを削除
              </button>
            </div>
          </div>

          {/* 免責事項 */}
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
            <p className="text-sm text-gray-700 dark:text-gray-300">
              ⚠️ このアプリは医療助言を提供するものではありません。歯や歯ぐきに関する症状がある場合は、歯科医師にご相談ください。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
