// リマインダーフック（デモ用：アプリ起動中のみ）
import { useEffect } from 'react';
import { useStore } from '../store/useStore';

export const useReminders = () => {
  const profile = useStore(state => state.profile);

  useEffect(() => {
    if (!profile.reminders.enabled) return;

    // 通知権限をリクエスト
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }

    const checkTime = () => {
      const now = new Date();
      const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

      const shouldNotify = 
        (profile.reminders.morning === currentTime) ||
        (profile.reminders.night === currentTime);

      if (shouldNotify) {
        showNotification();
      }
    };

    const showNotification = () => {
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('ほめみがき Lite', {
          body: '歯みがきの時間です！',
          icon: '/icon-192.svg',
          badge: '/icon-192.svg',
        });
      } else {
        // フォールバック: トースト（実装簡略化のためconsole.log）
        console.log('歯みがきの時間です！');
      }
    };

    // 1分ごとにチェック
    const interval = setInterval(checkTime, 60 * 1000);

    return () => clearInterval(interval);
  }, [profile.reminders]);
};
