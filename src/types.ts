// ほめみがき Lite - データ型定義

export type TimeOfDay = 'morning' | 'night' | 'other';
export type SelfRating = 1 | 2 | 3 | 4 | 5;
export type BrushType = '複合植毛' | '大型・幅広・段差植毛' | '極細毛・スーパーテーパード毛' | '小型・コンパクト';

export type BrushLog = {
  id: string;
  dateISO: string;
  durationSec: number;
  timeOfDay: TimeOfDay;
  selfRating: SelfRating;
  bleeding?: boolean;
  sensitivity?: boolean;
  pain?: boolean;
  notes?: string;
  photoDataUrl?: string;
};

export type Profile = {
  nickname?: string;
  brushType?: BrushType | null;
  goal: {
    dailyTarget: 1 | 2;
    minutesPerDay: number;
  };
  reminders: {
    morning?: string;
    night?: string;
    enabled: boolean;
  };
};

export type AvatarReply = {
  praise: string[];   // 3件
  tip: string;        // 改善1つ
  nextCommitment: string;
  closing: string;
  flags: { adviseVisit: boolean };
};

export type AvatarMessage = {
  id: string;
  logId?: string;
  createdAt: string;
  role: 'assistant' | 'user';
  content: AvatarReply;
};

export type ExportBundle = {
  profile: Profile;
  logs: BrushLog[];
  messages: AvatarMessage[];
  version: 'homemigaki-lite-v1';
};

// 統計データ
export type WeekStats = {
  totalMinutes: number;
  streak: number;
  morningNightCoverage: number; // 0-100%
  avgDuration: number;
  avgRating: number;
  comparedToLastWeek: {
    totalMinutes: number;
    avgDuration: number;
    avgRating: number;
  };
};
