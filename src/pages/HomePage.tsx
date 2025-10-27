// ホーム画面
import { useState } from 'react';
import { Timer } from '../components/Timer';
import { LogForm } from '../components/LogForm';
import { AvatarCard } from '../components/AvatarCard';
import { useStore } from '../store/useStore';
import { calculateStreak } from '../lib/stats';
import { Link } from 'react-router-dom';

type Step = 'idle' | 'timer' | 'form' | 'avatar';

export const HomePage = () => {
  const [step, setStep] = useState<Step>('idle');
  const [duration, setDuration] = useState(0);
  const { logs, messages, addLog } = useStore();
  const streak = calculateStreak(logs);

  const latestMessage = messages[messages.length - 1];

  const handleTimerComplete = (seconds: number) => {
    setDuration(seconds);
    setStep('form');
  };

  const handleFormSubmit = (data: {
    durationSec: number;
    timeOfDay: any;
    selfRating: any;
    bleeding?: boolean;
    sensitivity?: boolean;
    pain?: boolean;
    notes?: string;
    photoDataUrl?: string;
  }) => {
    addLog({ ...data, dateISO: new Date().toISOString() });
    setStep('avatar');
  };

  const handleAvatarClose = () => {
    setStep('idle');
    setDuration(0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 左サイドバー - 統計サマリー */}
          <div className="lg:col-span-1 space-y-6">
            {/* ヘッダー */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                ほめみがき Lite
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                ほめられて続く歯みがき習慣
              </p>
            </div>

            {/* 連続日数 */}
            {streak > 0 && (
              <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl shadow-xl p-6 text-white">
                <div className="text-center">
                  <div className="text-5xl font-bold mb-2">🔥</div>
                  <div className="text-4xl font-bold mb-1">{streak}日</div>
                  <div className="text-lg opacity-90">連続記録</div>
                </div>
              </div>
            )}

            {/* クイック統計 */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">今週の記録</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">歯みがき回数</span>
                  <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">{logs.filter(l => {
                    const weekAgo = new Date();
                    weekAgo.setDate(weekAgo.getDate() - 7);
                    return new Date(l.dateISO) >= weekAgo;
                  }).length}回</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">合計時間</span>
                  <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                    {Math.floor(logs.filter(l => {
                      const weekAgo = new Date();
                      weekAgo.setDate(weekAgo.getDate() - 7);
                      return new Date(l.dateISO) >= weekAgo;
                    }).reduce((sum, l) => sum + l.durationSec, 0) / 60)}分
                  </span>
                </div>
              </div>
            </div>

            {/* ナビゲーション */}
            <div className="space-y-3">
              <Link
                to="/dashboard"
                className="block px-6 py-4 bg-blue-600 text-white rounded-xl font-semibold text-center hover:bg-blue-700 transition shadow-lg text-lg"
              >
                📊 詳しい統計を見る
              </Link>
              <Link
                to="/chat"
                className="block px-6 py-4 bg-purple-600 text-white rounded-xl font-semibold text-center hover:bg-purple-700 transition shadow-lg text-lg"
              >
                💬 チャット履歴
              </Link>
              <Link
                to="/settings"
                className="block px-6 py-4 bg-gray-600 text-white rounded-xl font-semibold text-center hover:bg-gray-700 transition shadow-lg text-lg"
              >
                ⚙️ 設定
              </Link>
            </div>
          </div>

          {/* メインコンテンツエリア */}
          <div className="lg:col-span-2">
            {step === 'idle' && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-12">
                <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-8 text-center">
                  今日の歯みがき
                </h2>
                <div className="max-w-md mx-auto">
                  <button
                    onClick={() => setStep('timer')}
                    className="w-full px-12 py-12 text-3xl font-bold text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800 transition shadow-2xl transform hover:scale-105"
                  >
                    🦷 開始
                  </button>
                </div>
              </div>
            )}

          {step === 'timer' && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 md:p-12">
              <Timer onComplete={handleTimerComplete} />
            </div>
          )}

          {step === 'form' && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-3xl mx-auto">
              <LogForm
                durationSec={duration}
                onSubmit={handleFormSubmit}
                onCancel={() => setStep('idle')}
              />
            </div>
          )}

          {step === 'avatar' && latestMessage && (
            <AvatarCard
              reply={latestMessage.content}
              onClose={handleAvatarClose}
            />
          )}
          </div>
        </div>
      </div>
    </div>
  );
};
