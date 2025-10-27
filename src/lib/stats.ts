// 統計計算ユーティリティ
import type { BrushLog, WeekStats } from '../types';

// 連続日数を計算
export const calculateStreak = (logs: BrushLog[]): number => {
  if (logs.length === 0) return 0;

  const sortedLogs = [...logs].sort((a, b) => 
    new Date(b.dateISO).getTime() - new Date(a.dateISO).getTime()
  );

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const uniqueDates = new Set<string>();
  sortedLogs.forEach(log => {
    const date = new Date(log.dateISO);
    date.setHours(0, 0, 0, 0);
    uniqueDates.add(date.toISOString().split('T')[0]);
  });

  const dates = Array.from(uniqueDates).sort().reverse();
  
  let streak = 0;
  let currentDate = new Date(today);

  for (const dateStr of dates) {
    const logDate = new Date(dateStr);
    const diffDays = Math.floor((currentDate.getTime() - logDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === streak) {
      streak++;
    } else if (diffDays > streak) {
      break;
    }
  }

  return streak;
};

// 今週の統計を計算
export const calculateWeekStats = (logs: BrushLog[]): WeekStats => {
  const now = new Date();
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay()); // 日曜始まり
  startOfWeek.setHours(0, 0, 0, 0);

  const startOfLastWeek = new Date(startOfWeek);
  startOfLastWeek.setDate(startOfLastWeek.getDate() - 7);

  const thisWeekLogs = logs.filter(log => new Date(log.dateISO) >= startOfWeek);
  const lastWeekLogs = logs.filter(log => {
    const date = new Date(log.dateISO);
    return date >= startOfLastWeek && date < startOfWeek;
  });

  const calculateStats = (weekLogs: BrushLog[]) => {
    const totalMinutes = weekLogs.reduce((sum, log) => sum + log.durationSec / 60, 0);
    const avgDuration = weekLogs.length > 0 ? totalMinutes / weekLogs.length : 0;
    const avgRating = weekLogs.length > 0 
      ? weekLogs.reduce((sum, log) => sum + log.selfRating, 0) / weekLogs.length 
      : 0;

    // 朝晩カバー率を計算
    const daysWithBrushing = new Map<string, Set<string>>();
    weekLogs.forEach(log => {
      const date = new Date(log.dateISO).toISOString().split('T')[0];
      if (!daysWithBrushing.has(date)) {
        daysWithBrushing.set(date, new Set());
      }
      if (log.timeOfDay === 'morning' || log.timeOfDay === 'night') {
        daysWithBrushing.get(date)!.add(log.timeOfDay);
      }
    });

    let coveredDays = 0;
    daysWithBrushing.forEach(times => {
      if (times.has('morning') && times.has('night')) {
        coveredDays++;
      }
    });

    const totalDays = 7;
    const morningNightCoverage = (coveredDays / totalDays) * 100;

    return { totalMinutes, avgDuration, avgRating, morningNightCoverage };
  };

  const thisWeek = calculateStats(thisWeekLogs);
  const lastWeek = calculateStats(lastWeekLogs);

  return {
    totalMinutes: thisWeek.totalMinutes,
    streak: calculateStreak(logs),
    morningNightCoverage: thisWeek.morningNightCoverage,
    avgDuration: thisWeek.avgDuration,
    avgRating: thisWeek.avgRating,
    comparedToLastWeek: {
      totalMinutes: thisWeek.totalMinutes - lastWeek.totalMinutes,
      avgDuration: thisWeek.avgDuration - lastWeek.avgDuration,
      avgRating: thisWeek.avgRating - lastWeek.avgRating,
    },
  };
};

// 直近N件のログを取得
export const getRecentLogs = (logs: BrushLog[], count: number): BrushLog[] => {
  return [...logs]
    .sort((a, b) => new Date(b.dateISO).getTime() - new Date(a.dateISO).getTime())
    .slice(0, count);
};

// 今日のログを取得
export const getTodayLogs = (logs: BrushLog[]): BrushLog[] => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  return logs.filter(log => {
    const logDate = new Date(log.dateISO);
    logDate.setHours(0, 0, 0, 0);
    return logDate.getTime() === today.getTime();
  });
};
