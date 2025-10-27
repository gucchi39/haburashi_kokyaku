// localStorage抽象化ラッパー
import type { Profile, BrushLog, AvatarMessage, ExportBundle } from '../types';

const STORAGE_KEYS = {
  PROFILE: 'homemigaki-profile',
  LOGS: 'homemigaki-logs',
  MESSAGES: 'homemigaki-messages',
  ONBOARDING_DONE: 'homemigaki-onboarding-done',
} as const;

// デフォルト値
const DEFAULT_PROFILE: Profile = {
  nickname: 'ユーザー',
  brushType: '極細毛・スーパーテーパード毛',
  goal: {
    dailyTarget: 2,
    minutesPerDay: 4,
  },
  reminders: {
    morning: '07:00',
    night: '21:00',
    enabled: false,
  },
};

// ダミーログデータを生成
const generateDummyLogs = (): BrushLog[] => {
  const logs: BrushLog[] = [];
  const now = new Date();
  
  // 過去7日間のダミーデータ
  for (let i = 6; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    // 朝の歯みがき
    if (Math.random() > 0.2) { // 80%の確率で朝も磨く
      logs.push({
        id: `dummy-log-${i}-morning`,
        dateISO: date.toISOString(),
        durationSec: 90 + Math.floor(Math.random() * 90), // 90-180秒
        timeOfDay: 'morning',
        selfRating: (Math.floor(Math.random() * 2) + 3) as 3 | 4 | 5, // 3-5
        bleeding: Math.random() > 0.9,
        sensitivity: Math.random() > 0.85,
        notes: i === 0 ? '今日も頑張りました！' : undefined,
      });
    }
    
    // 夜の歯みがき
    logs.push({
      id: `dummy-log-${i}-night`,
      dateISO: new Date(date.getTime() + 12 * 60 * 60 * 1000).toISOString(),
      durationSec: 100 + Math.floor(Math.random() * 80), // 100-180秒
      timeOfDay: 'night',
      selfRating: (Math.floor(Math.random() * 3) + 3) as 3 | 4 | 5, // 3-5
      bleeding: Math.random() > 0.95,
      sensitivity: Math.random() > 0.9,
      pain: Math.random() > 0.97,
    });
  }
  
  return logs;
};

// Profile
export const getProfile = (): Profile => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.PROFILE);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Failed to load profile:', error);
  }
  // 初回アクセス時はダミーデータを保存
  saveProfile(DEFAULT_PROFILE);
  return DEFAULT_PROFILE;
};

export const saveProfile = (profile: Profile): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
  } catch (error) {
    console.error('Failed to save profile:', error);
  }
};

// Logs
export const getLogs = (): BrushLog[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.LOGS);
    if (stored) {
      const logs = JSON.parse(stored);
      // データがあればそれを返す
      if (logs.length > 0) return logs;
    }
  } catch (error) {
    console.error('Failed to load logs:', error);
  }
  // 初回アクセス時はダミーデータを生成して保存
  const dummyLogs = generateDummyLogs();
  saveLogs(dummyLogs);
  return dummyLogs;
};

export const saveLogs = (logs: BrushLog[]): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(logs));
  } catch (error) {
    console.error('Failed to save logs:', error);
  }
};

export const addLog = (log: BrushLog): void => {
  const logs = getLogs();
  logs.push(log);
  saveLogs(logs);
};

// Messages
export const getMessages = (): AvatarMessage[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.MESSAGES);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Failed to load messages:', error);
  }
  return [];
};

export const saveMessages = (messages: AvatarMessage[]): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(messages));
  } catch (error) {
    console.error('Failed to save messages:', error);
  }
};

export const addMessage = (message: AvatarMessage): void => {
  const messages = getMessages();
  messages.push(message);
  saveMessages(messages);
};

// Onboarding
export const getOnboardingDone = (): boolean => {
  return localStorage.getItem(STORAGE_KEYS.ONBOARDING_DONE) === 'true';
};

export const setOnboardingDone = (done: boolean): void => {
  localStorage.setItem(STORAGE_KEYS.ONBOARDING_DONE, done ? 'true' : 'false');
};

// Export/Import
export const exportData = (): ExportBundle => {
  return {
    profile: getProfile(),
    logs: getLogs(),
    messages: getMessages(),
    version: 'homemigaki-lite-v1',
  };
};

export const importData = (bundle: ExportBundle): void => {
  if (bundle.version !== 'homemigaki-lite-v1') {
    throw new Error('Unsupported data version');
  }
  saveProfile(bundle.profile);
  saveLogs(bundle.logs);
  saveMessages(bundle.messages);
};

export const clearAllData = (): void => {
  Object.values(STORAGE_KEYS).forEach(key => {
    localStorage.removeItem(key);
  });
};
