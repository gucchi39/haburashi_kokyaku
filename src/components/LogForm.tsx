// ログ入力フォームコンポーネント
import { useState } from 'react';
import type { TimeOfDay, SelfRating } from '../types';

interface LogFormProps {
  durationSec: number;
  onSubmit: (data: {
    durationSec: number;
    timeOfDay: TimeOfDay;
    selfRating: SelfRating;
    bleeding?: boolean;
    sensitivity?: boolean;
    pain?: boolean;
    notes?: string;
    photoDataUrl?: string;
  }) => void;
  onCancel: () => void;
}

export const LogForm: React.FC<LogFormProps> = ({ durationSec, onSubmit, onCancel }) => {
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>('morning');
  const [selfRating, setSelfRating] = useState<SelfRating>(3);
  const [bleeding, setBleeding] = useState(false);
  const [sensitivity, setSensitivity] = useState(false);
  const [pain, setPain] = useState(false);
  const [notes, setNotes] = useState('');
  const [photoDataUrl, setPhotoDataUrl] = useState<string | undefined>();

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setPhotoDataUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      durationSec,
      timeOfDay,
      selfRating,
      bleeding: bleeding || undefined,
      sensitivity: sensitivity || undefined,
      pain: pain || undefined,
      notes: notes.trim() || undefined,
      photoDataUrl,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 p-8 md:p-12 max-w-3xl mx-auto">
      <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-8">歯みがき記録</h2>
      
      {/* 所要時間 */}
      <div>
        <label className="block text-xl font-semibold text-gray-700 dark:text-gray-300 mb-3">
          所要時間
        </label>
        <p className="text-5xl font-bold text-blue-600 dark:text-blue-400">
          {Math.floor(durationSec / 60)}分 {durationSec % 60}秒
        </p>
      </div>

      {/* 時間帯 */}
      <div>
        <label className="block text-xl font-semibold text-gray-700 dark:text-gray-300 mb-3">
          時間帯
        </label>
        <div className="flex space-x-4">
          {(['morning', 'night', 'other'] as const).map(tod => (
            <button
              key={tod}
              type="button"
              onClick={() => setTimeOfDay(tod)}
              className={`px-8 py-5 text-2xl rounded-2xl font-bold transition shadow-lg transform hover:scale-105 ${
                timeOfDay === tod
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              {tod === 'morning' ? '朝' : tod === 'night' ? '夜' : 'その他'}
            </button>
          ))}
        </div>
      </div>

      {/* 自己評価 */}
      <div>
        <label className="block text-xl font-semibold text-gray-700 dark:text-gray-300 mb-3">
          自己評価
        </label>
        <div className="flex space-x-3">
          {([1, 2, 3, 4, 5] as const).map(rating => (
            <button
              key={rating}
              type="button"
              onClick={() => setSelfRating(rating)}
              className={`text-6xl transition transform hover:scale-110 ${
                selfRating >= rating ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'
              }`}
            >
              ★
            </button>
          ))}
        </div>
      </div>

      {/* 症状チェック */}
      <div>
        <label className="block text-xl font-semibold text-gray-700 dark:text-gray-300 mb-3">
          症状チェック
        </label>
        <div className="space-y-4">
          {[
            { key: 'bleeding', label: '出血があった', state: bleeding, setState: setBleeding },
            { key: 'sensitivity', label: 'しみた', state: sensitivity, setState: setSensitivity },
            { key: 'pain', label: '痛みがあった', state: pain, setState: setPain },
          ].map(item => (
            <label key={item.key} className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={item.state}
                onChange={(e) => item.setState(e.target.checked)}
                className="w-7 h-7 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-xl text-gray-700 dark:text-gray-300 font-medium">{item.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* メモ */}
      <div>
        <label className="block text-xl font-semibold text-gray-700 dark:text-gray-300 mb-3">
          メモ（任意）
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={4}
          className="w-full px-6 py-4 text-xl border-2 border-gray-300 dark:border-gray-600 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
          placeholder="気づいたことを記録しましょう"
        />
      </div>

      {/* 写真 */}
      <div>
        <label className="block text-xl font-semibold text-gray-700 dark:text-gray-300 mb-3">
          写真（任意）
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={handlePhotoChange}
          className="block w-full text-xl text-gray-500 dark:text-gray-400
            file:mr-4 file:py-4 file:px-6
            file:rounded-xl file:border-0
            file:text-xl file:font-semibold
            file:bg-blue-50 file:text-blue-700
            hover:file:bg-blue-100
            dark:file:bg-gray-700 dark:file:text-blue-400"
        />
        {photoDataUrl && (
          <img src={photoDataUrl} alt="記録写真" className="mt-4 max-w-full h-48 object-cover rounded-2xl shadow-lg" />
        )}
      </div>

      {/* ボタン */}
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          type="submit"
          className="flex-1 px-12 py-6 text-2xl text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl font-bold hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800 transition shadow-xl transform hover:scale-105"
        >
          ✅ 記録する
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-12 py-6 text-2xl text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 rounded-2xl font-bold hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600 transition shadow-xl transform hover:scale-105"
        >
          ❌ キャンセル
        </button>
      </div>
    </form>
  );
};
