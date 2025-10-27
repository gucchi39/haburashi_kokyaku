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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* ヘッダー */}
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            ほめみがき Lite
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            ほめられて続く歯みがき習慣
          </p>
        </header>

        {/* 連続日数バッジ */}
        {streak > 0 && (
          <div className="text-center mb-6">
            <div className="inline-block px-6 py-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-full font-bold text-lg shadow-lg">
              🔥 {streak}日連続！
            </div>
          </div>
        )}

        {/* メインコンテンツ */}
        <div className="max-w-2xl mx-auto">
          {step === 'idle' && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
                今日の歯みがき
              </h2>
              <button
                onClick={() => setStep('timer')}
                className="w-full px-8 py-6 text-xl font-bold text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800 transition shadow-lg"
              >
                開始
              </button>

              {/* ナビゲーション */}
              <div className="grid grid-cols-2 gap-4 mt-8">
                <Link
                  to="/dashboard"
                  className="px-4 py-3 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg font-semibold text-center hover:bg-blue-200 dark:hover:bg-blue-900/50 transition"
                >
                  📊 統計
                </Link>
                <Link
                  to="/chat"
                  className="px-4 py-3 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-lg font-semibold text-center hover:bg-purple-200 dark:hover:bg-purple-900/50 transition"
                >
                  💬 チャット
                </Link>
                <Link
                  to="/settings"
                  className="px-4 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-semibold text-center hover:bg-gray-200 dark:hover:bg-gray-600 transition"
                >
                  ⚙️ 設定
                </Link>
              </div>
            </div>
          )}

          {step === 'timer' && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl">
              <Timer onComplete={handleTimerComplete} />
            </div>
          )}

          {step === 'form' && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl">
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
  );
};
