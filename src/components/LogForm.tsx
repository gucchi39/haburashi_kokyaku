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
    <form onSubmit={handleSubmit} className="space-y-6 p-6 md:p-8 max-w-2xl mx-auto">
      <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">歯みがき記録</h2>
      
      {/* 所要時間 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          所要時間
        </label>
        <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
          {Math.floor(durationSec / 60)}分 {durationSec % 60}秒
        </p>
      </div>

      {/* 時間帯 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          時間帯
        </label>
        <div className="flex space-x-4">
          {(['morning', 'night', 'other'] as const).map(tod => (
            <button
              key={tod}
              type="button"
              onClick={() => setTimeOfDay(tod)}
              className={`px-4 py-2 rounded-lg font-medium transition ${
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
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          自己評価
        </label>
        <div className="flex space-x-2">
          {([1, 2, 3, 4, 5] as const).map(rating => (
            <button
              key={rating}
              type="button"
              onClick={() => setSelfRating(rating)}
              className={`text-3xl transition ${
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
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          症状チェック
        </label>
        <div className="space-y-2">
          {[
            { key: 'bleeding', label: '出血があった', state: bleeding, setState: setBleeding },
            { key: 'sensitivity', label: 'しみた', state: sensitivity, setState: setSensitivity },
            { key: 'pain', label: '痛みがあった', state: pain, setState: setPain },
          ].map(item => (
            <label key={item.key} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={item.state}
                onChange={(e) => item.setState(e.target.checked)}
                className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-gray-700 dark:text-gray-300">{item.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* メモ */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          メモ（任意）
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
          placeholder="気づいたことを記録しましょう"
        />
      </div>

      {/* 写真 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          写真（任意）
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={handlePhotoChange}
          className="block w-full text-sm text-gray-500 dark:text-gray-400
            file:mr-4 file:py-2 file:px-4
            file:rounded-lg file:border-0
            file:text-sm file:font-semibold
            file:bg-blue-50 file:text-blue-700
            hover:file:bg-blue-100
            dark:file:bg-gray-700 dark:file:text-blue-400"
        />
        {photoDataUrl && (
          <img src={photoDataUrl} alt="記録写真" className="mt-2 max-w-full h-32 object-cover rounded-lg" />
        )}
      </div>

      {/* ボタン */}
      <div className="flex space-x-4">
        <button
          type="submit"
          className="flex-1 px-6 py-3 text-white bg-blue-600 rounded-lg font-semibold hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800 transition"
        >
          記録する
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-3 text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 rounded-lg font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600 transition"
        >
          キャンセル
        </button>
      </div>
    </form>
  );
};
