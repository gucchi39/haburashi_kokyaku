# ほめみがき Lite# React + TypeScript + Vite



**ほめられて続く歯みがき習慣をサポートするPWA**This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.



完全フロントエンド（ゼロバックエンド）で動作する、歯みがき記録＆サポートアプリです。Currently, two official plugins are available:



## 特徴- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh

- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

- 🦷 **タイマー機能**: 歯みがきの所要時間を計測

- 👩‍⚕️ **スーパー衛生士アバター**: 記録のたびにほめて、アドバイス（疑似AI・ルールベース）## React Compiler

- 📊 **統計・グラフ**: 連続日数、週次統計、推移グラフで進捗を確認

- 🔔 **リマインダー**: アプリ起動中のみ通知（デモ用）The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

- 💾 **データ管理**: JSON形式でエクスポート/インポート可能

- 📱 **PWA対応**: オフライン動作、ホーム画面に追加可能## Expanding the ESLint configuration

- 🌓 **ダーク/ライトモード**: システム設定に自動対応

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

## 動かし方

```js

### 1. インストールexport default defineConfig([

  globalIgnores(['dist']),

```bash  {

npm install    files: ['**/*.{ts,tsx}'],

```    extends: [

      // Other configs...

### 2. 開発サーバー起動

      // Remove tseslint.configs.recommended and replace with this

```bash      tseslint.configs.recommendedTypeChecked,

npm run dev      // Alternatively, use this for stricter rules

```      tseslint.configs.strictTypeChecked,

      // Optionally, add this for stylistic rules

ブラウザで [http://localhost:5173](http://localhost:5173) を開いてください。      tseslint.configs.stylisticTypeChecked,



### 3. ビルド      // Other configs...

    ],

```bash    languageOptions: {

npm run build      parserOptions: {

```        project: ['./tsconfig.node.json', './tsconfig.app.json'],

        tsconfigRootDir: import.meta.dirname,

ビルド成果物は `dist/` フォルダに生成されます。      },

      // other options...

### 4. プレビュー    },

  },

```bash])

npm run preview```

```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

## 技術スタック

```js

- **フレームワーク**: Vite + React 19 + TypeScript// eslint.config.js

- **スタイリング**: Tailwind CSS（ダーク/ライトモード対応）import reactX from 'eslint-plugin-react-x'

- **状態管理**: Zustandimport reactDom from 'eslint-plugin-react-dom'

- **ルーティング**: React Router v6

- **データ永続化**: localStorage（抽象化ラッパー `storage.ts`）export default defineConfig([

- **グラフ**: Chart.js + react-chartjs-2  globalIgnores(['dist']),

- **PWA**: vite-plugin-pwa + Workbox  {

- **PDF/画像出力**: html2canvas + jsPDF（必要に応じて実装可能）    files: ['**/*.{ts,tsx}'],

    extends: [

## データスキーマ      // Other configs...

      // Enable lint rules for React

### BrushLog（歯みがき記録）      reactX.configs['recommended-typescript'],

      // Enable lint rules for React DOM

```typescript      reactDom.configs.recommended,

{    ],

  id: string;              // 自動生成ID    languageOptions: {

  dateISO: string;         // ISO 8601形式      parserOptions: {

  durationSec: number;     // 所要時間（秒）        project: ['./tsconfig.node.json', './tsconfig.app.json'],

  timeOfDay: 'morning' | 'night' | 'other';        tsconfigRootDir: import.meta.dirname,

  selfRating: 1 | 2 | 3 | 4 | 5;      },

  bleeding?: boolean;      // other options...

  sensitivity?: boolean;    },

  pain?: boolean;  },

  notes?: string;])

  photoDataUrl?: string;   // Base64エンコード画像```

}
```

### Profile（プロフィール）

```typescript
{
  nickname?: string;
  brushType?: '複合植毛' | '大型・幅広・段差植毛' | '極細毛・スーパーテーパード毛' | '小型・コンパクト' | null;
  goal: {
    dailyTarget: 1 | 2;
    minutesPerDay: number;
  };
  reminders: {
    morning?: string;       // HH:MM形式
    night?: string;
    enabled: boolean;
  };
}
```

### AvatarMessage（アバター返答）

```typescript
{
  id: string;
  logId?: string;
  createdAt: string;
  role: 'assistant' | 'user';
  content: {
    praise: string[];           // 褒める（3点）
    tip: string;                // 改善提案（1点）
    nextCommitment: string;     // 次の約束
    closing: string;            // 励まし
    flags: { adviseVisit: boolean };
  };
}
```

### ExportBundle（エクスポート形式）

```typescript
{
  profile: Profile;
  logs: BrushLog[];
  messages: AvatarMessage[];
  version: 'homemigaki-lite-v1';
}
```

## コア体験（MVP）

### 1. 今日の歯みがき
- タイマーで所要時間を計測
- 記録フォームで詳細を入力（時間帯、自己評価、症状チェック、メモ、写真）
- 記録後、スーパー衛生士アバターから即座にフィードバック

### 2. スーパー衛生士アバター
- **褒める（3点）**: 連続日数、今回の記録、評価などを肯定的にフィードバック
- **改善提案（1点）**: 症状や記録傾向から具体的なアドバイス
- **次の約束**: 次回の目標を提案
- **励まし**: モチベーション向上のメッセージ
- **受診勧奨**: 症状が重い場合は歯科受診を促す（医療判断は行わない）

### 3. ダッシュボード
- 今週の統計（合計時間、連続日数、平均所要時間、自己評価平均）
- 先週比の増減表示
- 朝晩カバー率の進捗バー
- 7日間の推移グラフ（所要時間、回数）

### 4. リマインダー（デモ用）
- 朝/夜の時刻を設定
- アプリ**起動中のみ**Notification APIで通知
- 権限がない場合はコンソールログ（トースト代替）

### 5. データ入出力
- JSONエクスポート: ファイルとしてダウンロード
- JSONインポート: データを完全復元
- データ削除: 確認後に全データクリア

## フォルダ構成

```
src/
├── components/
│   ├── Timer.tsx          # タイマー
│   ├── LogForm.tsx        # 記録フォーム
│   ├── AvatarCard.tsx     # アバター返答カード
│   └── Charts.tsx         # グラフ
├── pages/
│   ├── OnboardingPage.tsx # オンボーディング
│   ├── HomePage.tsx       # ホーム
│   ├── DashboardPage.tsx  # 統計
│   ├── ChatPage.tsx       # チャット履歴
│   └── SettingsPage.tsx   # 設定
├── store/
│   └── useStore.ts        # Zustandストア
├── lib/
│   ├── storage.ts         # localStorage抽象化
│   ├── stats.ts           # 統計計算
│   └── generateAvatarReply.ts  # 疑似AI返答生成
├── hooks/
│   └── useReminders.ts    # リマインダーフック
├── types.ts               # 型定義
├── App.tsx                # メインアプリ
└── main.tsx               # エントリーポイント
```

## 既知の制限

1. **リマインダーは起動中のみ**  
   PWAのバックグラウンド通知は未実装（デモ用）。将来的にはService WorkerでのPush通知を検討。

2. **完全オフライン動作**  
   外部APIは使用していないため、インターネット接続不要。

3. **疑似AI**  
   LLM接続はなく、ルールベースで返答を生成。将来的にLLM API統合も可能。

4. **ブラウザのlocalStorage依存**  
   データはブラウザごとに保存されるため、端末間の同期は未実装。

## 受け入れ基準（MVP）

- ✅ 記録→即座にアバター返答が表示される
- ✅ 連続日数・統計が更新され、グラフに反映される
- ✅ リマインダーは起動中に時刻一致で通知/トースト
- ✅ エクスポートしたJSONをインポートすると完全復元できる

## ライセンス・免責事項

このアプリは**医療助言を提供するものではありません**。セルフケアの一般的な情報のみを扱います。歯や歯ぐきに関する症状がある場合は、必ず歯科医師にご相談ください。

---

**ほめみがき Lite** — ほめられて続く歯みがき習慣を、今すぐ始めましょう！
