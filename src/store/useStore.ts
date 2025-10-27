// Zustand ストア
import { create } from 'zustand';
import type { Profile, BrushLog, AvatarMessage } from '../types';
import * as storage from '../lib/storage';
import { generateAvatarReply } from '../lib/generateAvatarReply';
import { calculateWeekStats, calculateStreak, getRecentLogs } from '../lib/stats';

interface AppState {
  // データ
  profile: Profile;
  logs: BrushLog[];
  messages: AvatarMessage[];
  onboardingDone: boolean;

  // アクション
  loadData: () => void;
  
  // Profile
  updateProfile: (profile: Partial<Profile>) => void;
  
  // Logs
  addLog: (log: Omit<BrushLog, 'id'>) => void;
  
  // Messages
  addMessageWithReply: (logId: string) => void;
  
  // Onboarding
  completeOnboarding: () => void;
  
  // Export/Import
  exportData: () => void;
  importData: (jsonString: string) => void;
  clearAllData: () => void;
}

export const useStore = create<AppState>((set, get) => ({
  // 初期状態
  profile: storage.getProfile(),
  logs: storage.getLogs(),
  messages: storage.getMessages(),
  onboardingDone: storage.getOnboardingDone(),

  // データ読み込み
  loadData: () => {
    set({
      profile: storage.getProfile(),
      logs: storage.getLogs(),
      messages: storage.getMessages(),
      onboardingDone: storage.getOnboardingDone(),
    });
  },

  // Profile更新
  updateProfile: (updates) => {
    const current = get().profile;
    const updated = { ...current, ...updates };
    storage.saveProfile(updated);
    set({ profile: updated });
  },

  // Log追加
  addLog: (logData) => {
    const newLog: BrushLog = {
      ...logData,
      id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    };
    
    const logs = [...get().logs, newLog];
    storage.saveLogs(logs);
    set({ logs });

    // アバター返答を自動生成
    get().addMessageWithReply(newLog.id);
  },

  // アバター返答を生成して追加
  addMessageWithReply: (logId) => {
    const { logs, messages } = get();
    const log = logs.find(l => l.id === logId);
    if (!log) return;

    const streak = calculateStreak(logs);
    const stats = calculateWeekStats(logs);
    const recentLogs = getRecentLogs(logs, 5);

    const reply = generateAvatarReply(log, streak, stats, recentLogs);

    const newMessage: AvatarMessage = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      logId,
      createdAt: new Date().toISOString(),
      role: 'assistant',
      content: reply,
    };

    const updatedMessages = [...messages, newMessage];
    storage.saveMessages(updatedMessages);
    set({ messages: updatedMessages });
  },

  // Onboarding完了
  completeOnboarding: () => {
    storage.setOnboardingDone(true);
    set({ onboardingDone: true });
  },

  // データエクスポート
  exportData: () => {
    const data = storage.exportData();
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `homemigaki-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  },

  // データインポート
  importData: (jsonString) => {
    try {
      const data = JSON.parse(jsonString);
      storage.importData(data);
      get().loadData();
    } catch (error) {
      console.error('Failed to import data:', error);
      throw new Error('インポートに失敗しました。正しいJSONファイルか確認してください。');
    }
  },

  // 全データクリア
  clearAllData: () => {
    storage.clearAllData();
    set({
      profile: storage.getProfile(),
      logs: [],
      messages: [],
      onboardingDone: false,
    });
  },
}));
