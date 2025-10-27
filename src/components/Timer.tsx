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
    <div className="flex flex-col items-center justify-center p-8 space-y-6">
      <div className="text-6xl font-bold font-mono text-blue-600 dark:text-blue-400">
        {formatTime(seconds)}
      </div>
      
      {!isRunning && seconds === 0 && (
        <button
          onClick={handleStart}
          className="px-8 py-4 text-lg font-semibold text-white bg-blue-600 rounded-full hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800 transition"
        >
          開始
        </button>
      )}
      
      {isRunning && (
        <div className="flex space-x-4">
          <button
            onClick={handleStop}
            className="px-8 py-4 text-lg font-semibold text-white bg-green-600 rounded-full hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-300 dark:focus:ring-green-800 transition"
          >
            終了
          </button>
        </div>
      )}
    </div>
  );
};
