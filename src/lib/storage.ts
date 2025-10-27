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
  nickname: undefined,
  brushType: null,
  goal: {
    dailyTarget: 1,
    minutesPerDay: 2,
  },
  reminders: {
    enabled: false,
  },
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
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Failed to load logs:', error);
  }
  return [];
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
