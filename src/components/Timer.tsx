// タイマーコンポーネント
import { useState, useEffect, useRef } from 'react';

interface TimerProps {
  onComplete: (seconds: number) => void;
}

export const Timer: React.FC<TimerProps> = ({ onComplete }) => {
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = window.setInterval(() => {
        setSeconds(s => s + 1);
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning]);

  const handleStart = () => {
    setIsRunning(true);
  };

  const handleStop = () => {
    setIsRunning(false);
    onComplete(seconds);
  };

  const formatTime = (totalSeconds: number): string => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col items-center justify-center p-12 md:p-16 space-y-12">
      <div className="text-9xl md:text-[12rem] font-bold font-mono text-blue-600 dark:text-blue-400">
        {formatTime(seconds)}
      </div>
      
      {!isRunning && seconds === 0 && (
        <button
          onClick={handleStart}
          className="px-20 py-12 text-4xl md:text-5xl font-bold text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-full hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800 transition transform hover:scale-105 shadow-2xl"
        >
          ▶️ 開始
        </button>
      )}
      
      {isRunning && (
        <div className="flex space-x-6">
          <button
            onClick={handleStop}
            className="px-20 py-12 text-4xl md:text-5xl font-bold text-white bg-gradient-to-r from-green-600 to-teal-600 rounded-full hover:from-green-700 hover:to-teal-700 focus:outline-none focus:ring-4 focus:ring-green-300 dark:focus:ring-green-800 transition transform hover:scale-105 shadow-2xl"
          >
            ✅ 終了
          </button>
        </div>
      )}
    </div>
  );
};
